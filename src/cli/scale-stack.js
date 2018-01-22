import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import find from 'lodash/find'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import { describeStacks, updateAutoScalingGroup } from '../api';

const builder = (yargs) => {
  yargs
    .options({
      'stackName': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
      'min': {
        alias: 'i',
        type: 'number',
        description: 'The minimum capacity',
      },
      'max': {
        alias: 'x',
        type: 'number',
        description: 'The maximum capacity',
      },
      'desired': {
        alias: 'd',
        type: 'number',
        description: 'The desired capacity',
        demandOption: true,
      },
      'autoScalingGroupOutput': {
        alias: 'o',
        type: 'string',
        default: 'AutoScalingGroup',
        description: 'The stack output value for the AutoScalingGroup name',
      },
    });
}
const handlerAsync = async ({ stackName, min, max, desired, region, autoScalingGroupOutput }) => {
  const minValue = min || desired;
  const maxValue = max || desired;
  const data = await describeStacks(stackName, region);
  const output = find(data.Stacks[0].Outputs, (o) => o.OutputKey === autoScalingGroupOutput);
  if (!output) throw new Error(`missing stack output \'${autoScalingGroupName}\'`);
  const autoScalingGroupName = output.OutputValue;
  await updateAutoScalingGroup(autoScalingGroupName, minValue, maxValue, desired, region);
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
  command: 'scale-stack',
  description: 'Scale a stack\'s auto scaling group to the required capacity',
  builder,
  handler,
})
