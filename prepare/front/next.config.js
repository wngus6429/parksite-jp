const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true", //애가 true여야 실행
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";
    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval",
      plugins: [...config.plugins, new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ja$/)],
    };
  },
});

//웹팩은 넥스트 기본 설정이 있어서. 다른 리액트 같은
//웹펙 설정하듯이 하면 안되고 config로 바꿔줘야함
//hidden-source-map 안하면 배포 환경에서 소스 다 노출됨
//여기서 immer 써도 됨. 불변성이 여기서도 있으니
