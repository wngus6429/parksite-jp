const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends (
  Model
) {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        // RetweetId
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 이모티콘 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define(
//     "Post",
//     {
//       //MySql 에는 users테이블 생성
//       //id는 mysql에서 자동으로 넣어줌
//       content: { type: DataTypes.TEXT, allowNull: false },
//     }, //TEXT는 길이 무제한
//     //RetweetId
//     {
//       charset: "utf8mb4", //mb4는 이모티콘도 가능하게끔
//       collate: "utf8mb4_general_ci", //한글저장
//     }
//   );
//   Post.associate = (db) => {
//     db.Post.belongsTo(db.User); //어떤 게시글은 어떤 작성자 한테 속해 있겟지 // post.addUser // post.getUser 게시글 작성가 가져오는거 // post.setUser set은 바꾸는거
//     db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //해쉬태그는 다대다 관계 // post.addHashtags
//     db.Post.hasMany(db.Comment); //하나의 게시글에 댓글 여러개 // post.addComments란게 생김 , post.getComments 댓글 가져오는거
//     db.Post.hasMany(db.Image); //하나의 게시글이 이미지 여러개 , post.addImages가 생김 , post.getImages
//     db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //포스트에 좋아요를 누른사람들, post.addLikers, post.removeLikers 란게 생김
//     db.Post.belongsTo(db.Post, { as: "Retweet" }); //리트윗관계 //post.addRetweet이란게 생김
//   };
//   return Post;
// };
