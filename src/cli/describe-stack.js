import AWS from 'aws-sdk';
import { stripQuotes } from '../utils';

export const builder = (yargs) => {
  yargs
    .options({
      'name': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
    })
}

export default ({ name, profile, region }) => {
  console.log('describe stack')
  var credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;

  const cf = new AWS.CloudFormation({ region });
  cf.describeStacks({
    StackName: name,
  }, (err, data) => {
    if (err) throw new Error(err);
    console.log(stripQuotes(JSON.stringify(data.Stacks[0])));
  })
}
