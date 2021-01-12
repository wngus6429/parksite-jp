exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); //다음 미들웨어로
  } else {
    res.status(401).send("ログインしてください。");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(); //다음 미들웨어로
  } else {
    res.status(401).send("ログインしてください。");
  }
};
