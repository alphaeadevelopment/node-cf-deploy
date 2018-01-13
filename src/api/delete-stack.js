import AWS from 'aws-sdk';

export default ({ name, region }) => {
  return new Promise((res, rej) => {
    const cf = new AWS.CloudFormation({ region });

    cf.deleteStack({
      StackName: name,
    }, (err, data) => {
      if (err) rej(err);
      else return res();
    });
  })
}
