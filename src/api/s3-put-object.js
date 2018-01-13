import AWS from 'aws-sdk';

export default (bucket, key, data) => {
  if (!bucket) throw new Error("Missing mandatory argument 'bucket'");
  if (!key) throw new Error("Missing mandatory argument 'key'");
  if (!data) throw new Error("Missing mandatory argument 'data'");

  const s3 = new AWS.S3();
  return new Promise((res, rej) => {
    s3.putObject({
      Bucket: bucket,
      Body: data,
      Key: key,
    }, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data.ETag);
    });
  })
}
