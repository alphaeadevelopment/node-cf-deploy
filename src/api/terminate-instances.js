import AWS from 'aws-sdk';

export default ({ region, ids }) => {
  return new Promise((res, rej) => {
    const ec2 = new AWS.EC2({ region });

    ec2.terminateInstances({
      InstanceIds: ids,
    }, (err, data) => {
      if (err) rej(err);
      else return res(data);
    });
  })
}
