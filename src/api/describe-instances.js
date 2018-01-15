import AWS from 'aws-sdk';

export default ({ region, tags }) => {
  return new Promise((res, rej) => {
    const ec2 = new AWS.EC2({ region });

    const filters = [];
    filters.push({ Name: 'instance-state-name', Values: ['running'] });
    Object.keys(tags).forEach((k) => {
      filters.push({
        Name: `tag:${k}`,
        Values: tags[k].split(','),
      });
    })

    ec2.describeInstances({
      Filters: filters,
    }, (err, data) => {
      if (err) rej(err);
      else return res(data);
    });
  })
}
