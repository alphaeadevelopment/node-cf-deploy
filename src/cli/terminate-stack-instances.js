import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import includes from 'lodash/includes'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import {
  describeStacks,
  terminateInstances,
  describeInstances
} from '../api';

const builder = (yargs) => {
  yargs
    .options({
      'stackName': {
        alias: 'n',
        type: 'string',
      },
    });
}

const handlerAsync = async ({ region, stackName }) => {
  const stacks = await describeStacks(stackName, region);
  const stackId = stacks.Stacks[0].StackId
  const instances = await describeInstances({
    region,
    tags: { 'aws:cloudformation:stack-id': stackId },
  });
  const ids = instances.Reservations.map(r => r.Instances.map(i => i.InstanceId)).reduce((arr, a) => arr.concat(a), []);
  if (ids.length > 0) {
    terminateInstances({ region, ids });
  }
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
  command: 'terminate-stack-instances',
  description: 'Terminate EC2 Instances by stack name',
  builder,
  handler,
})
