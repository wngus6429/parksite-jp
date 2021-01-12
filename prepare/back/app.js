const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./models");
const passport = require("passport");
const passportConfig = require("./passport");
const hpp = require("hpp");
const helmet = require("helmet");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 連結 成功");
  })
  .catch(console.error);
passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); //combine으로 하면 log가 더 자세해짐
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: "http://parkbird.site",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "http://localhost:9000",
      credentials: true,
    })
  );
}

//맨앞 / 는 locahost3065가 된다. __dirname은 현재 폴더 back 안에 uploads 애를 합쳐줌
app.use("/", express.static(path.join(__dirname, "uploads")));
//프론트에서 온 정보를 req.body안에 넣어주는 역할을 이 두줄이 한다
app.use(express.json()); //프론트에서 온 json형식 데이터를 req.body안에 넣음
app.use(express.urlencoded({ extended: true }));
//form submit을 했을때 url인코딩 방식으로 데이터가 오는데.form 데이터를 req.body에 연결
app.use(cookieParser(process.env.COOKIE_SECRET)); //브라우저랑 백엔드 정보 일치를 위해, 문자 이상하게 보냄
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, //쿠키는 자바스크립트가 접근 안되게 해야하고
      secure: false,
      domain: process.env.NODE_ENV === "production" && "parkbird.site", //앞에 . 붙여야함
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/posts", postsRouter); //이건 제로초 스타일, 복수와 단수 나눔
app.use("/post", postRouter); //앞에 "/post"를 붙임으로 인해서
//routes폴더 post.js안에 있는 라우터들 앞에 자동으로 /post가 붙음
//중복제거 , 앞에 post붙이는걸 프리픽스라고 한다
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

//에러처리 미들웨어는 여기쯤에 내부적으로 있음

app.listen(80, () => {
  console.log("서버 실행 중!");
});

//브라우저 주소창에 치는건 get 요청임
//post, delete를 보내려면 프론트처럼, axios 같은거롤 자바스크립트로 post요청을 보내거나
//postman같은 툴이 필요하다 postman으로 post, put, patch같은거 다 사용가능
