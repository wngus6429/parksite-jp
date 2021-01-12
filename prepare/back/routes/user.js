const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");
const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

//Get /user
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        }, //원하는 정보만 받기, 비밀번호만 안 받고  싶음
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null); //사용자가 없으면 안 보내줌
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//attributes: ["id"]는 아이디만 가져오게끔. 팔로잉, 팔로워 숫자만 알면 되는데 데이터 다 가져오면 렉 + 데이터 사용량 증가
//서버에서 프론트로 필요한 데이터만 보내주는거임

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); //나 먼저 찾고
    if (!user) {
      res.status(403).send("いない人を探そうとしています。");
    }
    const followers = await user.getFollowers({ limit: parseInt(req.query.limit, 10) });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); //나 먼저 찾고
    if (!user) {
      res.status(403).send("いない人を探そうとしています。");
    }
    const followings = await user.getFollowings({ limit: parseInt(req.query.limit, 10) });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get /user/1
router.get("/:userId", async (req, res, next) => {
  try {
    //로그인 안 했는데 매번 새로고침시 작동하면 where요쪽 에러
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      }, //원하는 정보만 받기, 비밀번호만 안 받고  싶음
      include: [
        { model: Post, attributes: ["id"] },
        { model: User, as: "Followings", attributes: ["id"] },
        { model: User, as: "Followers", attributes: ["id"] },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); //시퀄라이즈에서 온 데이터는 toJson()으로 json으로 바꿔야함
      data.Posts = data.Posts.length; //개인정보 침해 예방
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data); //사용자가 있으면 보내주고
    } else {
      res.status(404).json("存在しないユーザーです。"); //사용자가 없으면 안 보내줌
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET /user/1/posts
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId }; //초기로딩 ㅋㅋ 쿼리스트링 5분
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때 //스크롤 내려서 더 불러오는 상황
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //보다 작은
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 //lastId가 12면 12보다 작은거 부름
    //id가 라스트아이디보다 작은걸로 10개를 불러와라 //Op는 operator
    const posts = await Post.findAll({
      where,
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]], //처음에는 게시글 생성일 내림차순으로 정렬한다음
      include: [
        {
          model: User, //작성자정보
          attributes: ["id", "nickname"], //작성자 비밀번호 보이면 안되니
        },
        { model: Image },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"], //작성자 비밀번호 보이면 안되니
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, //좋아요 누른사람
          as: "Likers",
          attributes: ["id"],
        },
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
      ],
    });
    //console.log("get 게시물", posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      //info클라이언트 에러
      return res.status(401).send(info.reason); //401 허가되지 않음. 403 금지, http 상태코드검색
    }
    //이게 진짜 로그인 하는거
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        //혹시나 패스포트 에러가 날까 싶어서
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        }, //원하는 정보만 받기, 비밀번호만 안 받고  싶음
        include: [
          { model: Post, attributes: ["id"] },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword); //사용자 정보를 프론트로 넘겨줌
    });
  })(req, res, next);
}); //local 뒤의 부분은 passport폴더 local의 done 내용이 온거

//post/user/
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (exUser) {
      return res.status(403).send("すてに使用済みです。");
    } //리턴 안 붙이면 밑에꺼 까지 실행됨
    console.log("로그인쪽", req);
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok"); //200성공, 201은 의미를 둬서 생성된
  } catch (error) {
    console.error(error);
    next(error); //next로 에러보내면 편해진다, status(500)
  }
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update({ nickname: req.body.nickname }, { where: { id: req.user.id } }); //수정은 업데이트
    res.status(200).json({ nickname: req.body.nickname }); //여긴 바뀐닉네임 ㅋ
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("いない人をFollowしようとしています。");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("いない人をUnFollowしようとしています。");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("いない人をブロックしようとしています。");
    } //상대방이 나를 언팔로 하는거랑 내가 끊는거랑 같음
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
