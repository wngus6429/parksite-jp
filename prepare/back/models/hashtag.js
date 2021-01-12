const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Hashtag extends (
  Model
) {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "Hashtag",
        tableName: "hashtags",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 이모티콘 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     "Hashtag",
//     {
//       //MySql 에는 users테이블 생성
//       //id는 mysql에서 자동으로 넣어줌
//       name: { type: DataTypes.STRING(20), allowNull: false },
//     },
//     {
//       charset: "utf8mb4", //mb4는 이모티콘도 가능하게끔
//       collate: "utf8mb4_general_ci", //한글저장
//     }
//   );
//   Hashtag.associate = (db) => {
//     db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
//   };
//   return Hashtag;
// };
