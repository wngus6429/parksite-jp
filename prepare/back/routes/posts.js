const express = require("express");
//리밋과 오프셋 방식
const { Post, User, Image, Comment } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

//Get posts
router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10, //10개만 가져와라
      order: [
        ["createdAt", "DESC"], //처음에는 게시글 생성일 내림차순으로 정렬한다음
      ],
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
    console.log("get 게시물", posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
