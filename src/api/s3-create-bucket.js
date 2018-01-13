import AWS from 'aws-sdk';

export default (name, region) => {
  const s3 = new AWS.S3();

  return new Promise((res, rej) => {
    s3.createBucket({
      Bucket: name,
      ACL: 'private',
      CreateBucketConfiguration: {
        LocationConstraint: region,
      }
    }, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data.Location);
    });
  })
}
