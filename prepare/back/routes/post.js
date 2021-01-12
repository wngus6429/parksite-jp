const express = require("express");
const multer = require("multer");
const path = require("path"); //node에서 제공
const fs = require("fs"); //파일시스템을 조작할수 있는
const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
//params는 변수를 담는다
//게시글 작성

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uplaods folderがないので、生成します。");
  fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-1",
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "parkbird-s3",
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 }, //15MB
}); //대형 서비스되면 프론트에서 바로 클라우드로 가는 방법 써야함

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    }); //slice(1)은 앞에 해시태그 #를 떼버리는거 , 소문자, 대문자 둘다 되게 하기 위해 소문자 toLowerCase
    if (hashtags) {
      //해시태그 누가 등록 해뒀으면 등록하지말고, DB에 없으면 그때서야 등록하게 해야함/
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      ); //뒤에 map한게 위에 findOrCreate때문, //[#노드, true],[#리액트, true] 두번째게 생성된건지 find된건지 불리언값
      //배열에서 첫번째값만 가져오기위해
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      //이미지를 올린경우
      //post에 내용을 추가하기 위한 코드들
      if (Array.isArray(req.body.image)) {
        //이미지를 여러개 올리면 image:[제로초.png, 부기초.png] 이런식으로 옴
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        //create는 시퀄라이즈 . promise.all로 한방에 DB에 저장된다 // DB에는 파일주소만 현재
        await post.addImages(images);
      } else {
        //이미지를 하나만 올리면 image:제로초.png 배열이 아님
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, //댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, //게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, //좋아요 누른사람
          as: "Likers", //이렇게 해야 구별이됨
          attributes: ["id"],
        },
      ],
    });
    console.log("게시글작성", fullPost);
    res.status(201).json(fullPost); //이렇게 프론트로 돌려주고 그러면 saga, addpost 의 const result 이쪽에 들어감
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Post /post/images , array쓰는 이유는 여러장, single 쓰면 한장, 텍스트면 none
//field는 이미지 올리는 칸이 2개 이상일 경우
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  //여기는 이미지 업로드 후에 실행된다
  console.log(req.files);
  res.json(req.files.map((v) => v.location.replace(/\/original\//, "/thumb/")));
  //오리지널 폴더가 있으면 thumb, 그래야 원본이 아닌 리사이징된게 프론트로 가지
});

//SinglePost //GET /post/1   , 1번게시글 가져오기
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      //post가 존재하지 않으면
      return res.status(404).send("存在しない投稿です。");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//리트윗 //POST, /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }, //위에가 :postId니까
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      //post가 존재하지 않으면
      return res.status(403).send("存在しない投稿です。");
    } //자기개시글을 직접 리트윗하는것. 자기게시글을 남이 리트윗한것을 자기가 다시 리트윗 하는걸 막을거임
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send("自分が投稿したのは、Retweetできません。");
    } //게시글이 리트윗한건지 찾아보고 그거면 리트윗아이디를 쓰고 아니면 null인 애들은 post.id를 쓰고
    const retweetTargetId = post.RetweetId || post.id; //남의게시글을 다른 사람이 리트윗한거를 그걸 다시 리트윗 한거
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("すでにRetweetされています。");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet", //post모델 가보면 allowNull false되어있어서 반드시 넣어줘야함
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//동적 주소를 파라미터라 한다  //POST /post/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }, //위에가 :postId니까
    });
    if (!post) {
      //post가 존재하지 않으면
      return res.status(403).send("存在しない投稿です。");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment); //이렇게 프론트로 돌려주고 그러면 saga, addpost 의 const result 이쪽에 들어감
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    //post 있는지 검사를 해야지
    if (!post) {
      return res.status(403).send("投稿が存在していません。");
    }
    //포스트가 있따면
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//DELETE /post/1/like
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    //post 있는지 검사를 해야지
    if (!post) {
      return res.status(403).send("投稿が存在していません。");
    }
    await post.removeLikers(req.user.id); //여기다가 그냥 SQL 적어도됨. mysql2 확인
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//DELETE /post
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      //시퀄라이즈에서는 제거할때 destory를 쓴다 , 남이 삭제 못하게 2개로
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      }, //게시글 id랑, 내가 쓸 게시글
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
