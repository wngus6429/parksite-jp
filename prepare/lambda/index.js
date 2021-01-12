const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; //react-nodebird-s3
  const Key = decodeURIComponent(event.Records[0].s3.object.key); //decode는 한국어 지원 //original/1231234.png
  console.log(Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1];
  const ext = Key.split(".")[Key.split(".").length - 1].toLowerCase();
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  console.log("filename", filename, "ext", ext);
  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log("original", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: "inside" })
      .toFormat(requiredFormat)
      .toBuffer();
    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise();
    console.log("put", resizedImage.length);
    return callback(null, `thumb/${filename}`); //여기오면 에러없이 실행된거니 첫번쨰, 에러는 null
  } catch (error) {
    console.error(error);
    return callback(error);
  }
};
//람다는 AWS에 소스코드를 업로드하는데. 람다가 알아서 사용자 정보를 불러와서 key가 필요 없어.
//람다는 AWS자체에서 돌려줌, 돌리면서 계정정보를 자동으로 넣어줘서 따로 인증절차 없어도됨
//event에 s3업로드 이벤트가 들어있음

//sharp 공식문서 봐야함
