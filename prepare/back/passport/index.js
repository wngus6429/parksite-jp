const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //첫번째가 서버에러, 두번쨰가 성공
  });
  passport.deserializeUser(async (id, done) => {
    //이 부분은 라우터 실행되기 전에 항상 움직이는거임. 인증
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); //req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  local();
};
