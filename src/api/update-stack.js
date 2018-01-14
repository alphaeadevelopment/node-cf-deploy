import AWS from 'aws-sdk';

export default ({ name, region, s3Template, parameters }) => {
  return new Promise((res, rej) => {
    const cf = new AWS.CloudFormation({ region });

    console.log(name, region, s3Template, parameters);
    const params = [];
    Object.keys(parameters).forEach((k) => {
      params.push({
        ParameterKey: k,
        ParameterValue: parameters[k],
      })
    })

    cf.updateStack({
      StackName: name,
      TemplateURL: s3Template,
      Parameters: params,
    }, (err, data) => {
      if (err) rej(err);
      else res(data.StackId);
    });
  })
}
