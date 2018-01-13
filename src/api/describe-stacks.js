import AWS from 'aws-sdk';

export default (name, region) => {
  const cf = new AWS.CloudFormation({ region });

  return new Promise((res, rej) => {
    cf.describeStacks({
      StackName: name,
    }, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  })
}
