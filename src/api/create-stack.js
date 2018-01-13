import AWS from 'aws-sdk';

export default ({ name, region, s3Template, parameters }) => {
  return new Promise((res, rej) => {
    const cf = new AWS.CloudFormation({ region });

    const params = [];
    Object.keys(parameters).forEach((k) => {
      params.push({
        ParameterKey: k,
        ParameterValue: parameters[k],
      })
    })

    cf.createStack({
      StackName: name,
      TemplateURL: s3Template,
      Parameters: params,
    }, (err, data) => {
      if (err) rej(err);
      else return res(data.StackId);
    });
  })
}
