const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 이게 최신 문법임
module.exports = class Commend extends (
  Model
) {
  static init(sequelize) {
    return super.init(
      {
        content: { type: DataTypes.TEXT, allowNull: false },
        //User_Id:1
        //Post_Id:3
      },
      {
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8mb4", //mb4는 이모티콘도 가능하게끔
        collate: "utf8mb4_general_ci", //한글저장
        sequelize, //이건 index.js 연결 객체, 그거를 클래스로 보내줄거기 때문에 연결 객체를 여기다가 넣어줌
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User); //어떤 댓글은 작성자에 속해 있겟지
    db.Comment.belongsTo(db.Post); //belongTo를 하게 되면 위에 user_id, post_id처럼 컬럼이 생김}
  }
};

//model의 init을 호출 해줘야 테이블이 생성된다
