http://parkbird.site

- React, Redux, Hooks, Next(Framework),
- Nodejs, Mysql,AWS（ubuntu)
- https (追加予定)

# このプロジェクトやった理由

- [x] WEB サイトの全般の流れを理解したかったからです。
- [x] 後で自分が WEB サイトを作ってサービスを提供してみたいからです。
- [x] FrontEnd, backend, DB まで幅広く知識を得て、早く成長して欲しかったからです。
- [x] 全般的に理解した後、深く勉強していく予定です。

- [x] このプロジェクトは終わらないプロジェクトです。
- [x] ずっと改良を重ねる予定となっております。
- [x] ReadMe の内容もずっとアップデートする予定です。

# Next

https://nextjs.org/

- Next を使う一番のメリットは SSR (Server Side Rendering)のため
- Next は、React を使用したフレームワーク
- Next 最大のメリット、サーバーサイドランダリング(SSR)を容易に実現するフレームワーク
- SSR は初期ローディング速度が速く、検索エンジンに現れるようにする。

- 既存の React でもサーバーサイドランダリングが可能ですが、実装が難しいので、
- Next.js に助けられて楽に設定できるようにします。

- 前もってクリックするようなリンクがあれば、code spliting されたことを前もってもらってくることもします。
- データキャッシングもできるので、特定のアドレスにアクセスする際に loading がないこともみることができます。

# CSR (Client Side Rendering)

- 顧客の使用性を高めるため
- 顧客がページに入ったら、まず HTML と CSS のだけ顧客に見せてローディング中の画面を見せて、そのあと、BACKEND と DB からデータをもらってデータを HTML と CSS に埋めていく方式です。  
  <img src="https://user-images.githubusercontent.com/55697824/118532931-774b7f00-b782-11eb-9672-c2dfb290e157.PNG"></img>

# SSR (Server Side Rendering)

- 検索エンジンの上に表示させるため
- React を使うと最初は何もデータがない状況なので、検索エンジンが後回しにしてしまう。
- サーバーサイドランダリングで、最初の訪問だけ画面を表示し、
- （だからローディングがない）
- その後、他のページをクリックしたりすると、React が作動。ハイブリッド方式。

<img src="https://user-images.githubusercontent.com/55697824/118532912-7286cb00-b782-11eb-98f4-def8f9f9b433.PNG"></img>

# Code Spliting

- 訪問したページに対するコードだけを送る（スピード改善）
  <img src="https://user-images.githubusercontent.com/55697824/118533264-d4473500-b782-11eb-8035-d0c414f08327.PNG"></img>

# React (Single Page Application)

https://reactjs.org/

- 使用理由 1 = ユーザーエクスペリエンスもありますが、
- 使用理由 2 = 重複を避ける。 一つ変えるとすべて変えなければならないので、コンポーネントを使います。
- 使用理由 3 = データと画面の一致
- 使用理由 4 = メンテナンス簡単。
- 使用者によいいんたーぺ
- React を使えば画面にレイアウトなど何でも見えるので、
- お客様を泊まらせることができます。最近画面になにも表示されなかったら、すぐ後ろのページに行くお客さんが多いからです。
- 画面にデザインが見えるようにしてデータを受け取ってきて画面に表示する。
- React(CSR)はクライアントサイドランダリングであり、CSR はページ切り替えが早い。
- React は一度にページをすべてダウンロードするため, 最初に読み込むのが遅い。

# Redux (データを一か所に集めておく)

- 親から、子まで Component に何回渡していくのではなく一か所に集めてデータを渡す方法です。
- Redux Devtool を使うとデータのヒストリーを見ながら開発ができるので、役に立ちます。

# 機能

- ログイン
- ログアウト
- COOKIE
- 検索
- ハッシュタグ
- ハッシュタグ検索
- post 番号検索
- Follow
- Follower
- 投稿
- 投稿削除
- 投稿内容修正
- 申告（追加予定）
- イメージアップロード（aws s3, lambda resizing)
- イメージ拡大
- プロフィール
- Retweet
- ユーザーページ
- 特定ユーザーページ

# Front で使った NPM パッケージ

- Antd = デザインを楽にしてくれる
- Axios = API を楽にしてくれる
- faker = Dummy Data を使うことができる
- ShortId = 仮の ID を付与してくれる。
- Immer = 不変性に役立つ
- Redux Saga = Redux を楽に使うことができる
- prop-types = 型を検査
- react-slick = イメージをクリックしたら、拡大してくれるパッケージ
- styled-component = Component の性能を上げることができる
- useMemo = スタイルの cashing のため
- useCallback = 関数の cashing のため
- Redux-devtools-extension ＝ヒストリーを見ることができる。エラー直しが安い

# Back で使った NPM パッケージ

- bcrypt = hash 暗号か。
- cookie-parser = cookie をもらって使用できるようにしてくれる。
- Middleware。
- cors = ブラウザーセキュリティ政策
- dotenv = 大事な情報をいれる。
- express = サーバー。
- helmet = セキュリティ。
- hpp = セキュリティ。
- multer = イメージ、動画編集。
- morgan = データ通信速度表示。
- sequelize = Javascript を SQL に変更してくれる。
- passport = ログインに役立つパッケージ。
- nodemon = 保存すると自動的にサーバーを再起動する。

# AWS UBUNTU

- Free 利用

<img src="https://user-images.githubusercontent.com/55697824/104480572-119a8b00-5608-11eb-8e4a-c0449234d1cb.PNG"></img>

<img src="https://user-images.githubusercontent.com/55697824/104480588-15c6a880-5608-11eb-93b5-9430c928fb8d.PNG"></img>

<img src="https://user-images.githubusercontent.com/55697824/104480593-16f7d580-5608-11eb-8033-09fa40a91274.PNG"></img>
