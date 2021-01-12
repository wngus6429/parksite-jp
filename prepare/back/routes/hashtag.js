const express = require("express");
const { Op } = require("sequelize");

const { Post, Hashtag, Image, Comment, User } = require("../models");

const router = express.Router();

//GET /hashtag/노드 /해시태그 검색
router.get("/:hashtag", async (req, res, next) => {
  try {
    const where = {}; //초기로딩 ㅋㅋ 쿼리스트링 5분
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때 //스크롤 내려서 더 불러오는 상황
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //보다 작은
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 //lastId가 12면 12보다 작은거 부름
    //id가 라스트아이디보다 작은걸로 10개를 불러와라 //Op는 operator
    const posts = await Post.findAll({
      where,
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]],
      include: [
        //include한 애를 조건으로 적용할 수 있다
        { model: Hashtag, where: { name: decodeURIComponent(req.params.hashtag) } },
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

module.exports = router;
