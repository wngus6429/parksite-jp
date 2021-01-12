const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
//: 로 이름 바꿀수 있음
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //항상 await은 try로 감싼다고 보면됨
          const user = await User.findOne({
            where: { email }, //email:email , 이메일 있는지 검사 부분
          });
          if (!user) {
            //이메일 없으면
            return done(null, false, { reason: "存在しないメールです。" }); //passport는 응답을 보내주지는 않는다
            //done으로 결과를 판단해주는데. 자리를 기억. 첫번째 서버에러, 두번째 성공, 세번째 클라이언트에러 보내는쪽 문제
          } //이메일 존재하면 밑에 비밀번호 비교
          const result = await bcrypt.compare(password, user.password); //뒤에꺼는 db에 있는거, 앞에꺼는 사용자 입력
          if (result) {
            return done(null, user); //성공에 사용자 정보 넘겨주기
          }
          return done(null, false, { reason: "暗証番号が間違えています。" });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
}; //done이 콜백 같은거임
