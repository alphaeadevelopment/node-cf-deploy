import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import find from 'lodash/find'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import { describeStacks } from '../api';

const builder = (yargs) => {
  yargs
    .options({
      'stackName': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
      'outputName': {
        alias: 'o',
        type: 'string',
        description: 'The name of the output',
        demandOption: true,
      },
    });
}
const handlerAsync = async ({ stackName, outputName, region }) => {
  const data = await describeStacks(stackName, region);
  const output = find(data.Stacks[0].Outputs, (o) => o.OutputKey === outputName);
  return output && output.OutputValue;
}

const handler = (args) => {
  handlerAsync(args)
    .then(result => {
      if (result) console.log(result)
    })
    .catch(err => {
      console.log(err.message);
      process.exit(1);
    });
}

export default ({
  command: 'get-stack-output',
  description: 'Get output value of a stack',
  builder,
  handler,
})
