import AWS from 'aws-sdk';

import describeStacks from './describe-stacks';
import { stripQuotes } from '../utils';

export default async (name, region) => {
  const cf = new AWS.CloudFormation({ region });
  const data = await describeStacks(name, region);
  return stripQuotes(JSON.stringify(data.Stacks[0].StackStatus));
}
