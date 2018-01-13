export default ({ bucket, region, key }) => `https://s3-${region}.amazonaws.com/${bucket}/${key}`;
