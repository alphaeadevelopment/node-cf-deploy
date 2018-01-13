import AWS from 'aws-sdk';

export default (name) => {
  const s3 = new AWS.S3();

  return new Promise((res, rej) => {
    s3.headBucket({
      Bucket: name,
    }, (err, data) => {
      if (err) {
        if (err.statusCode === 404) {
          res({
            exists: false,
          });
        }
        else if (err.statusCode === 403) {
          res({
            exists: true,
            owned: false,
          });
        }
        else rej(err);
      }
      else res({
        exists: true,
        owned: true,
      });
    });
  })
}
