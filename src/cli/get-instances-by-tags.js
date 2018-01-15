import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import includes from 'lodash/includes'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import { s3BucketStatus, s3CreateBucket, s3PutObject, createStack, getStackStatus, describeInstances } from '../api';

const builder = (yargs) => {
  yargs
    .options({
      'tag': {
        alias: 'T',
        type: 'array',
      },
    });
}

const handlerAsync = async ({ region, tag }) => {
  const tags = tag.reduce((ps, p) => {
    const kvp = parseKeyValuePair(p, { convertNumbers: false });
    return Object.assign(ps, { [kvp.key]: kvp.value })
  }, {})
  const data = await describeInstances({
    region,
    tags,
  });
  console.log(data.Reservations.map(r => r.Instances.map(i => i.InstanceId)).reduce((arr, a) => arr.concat(a), []));
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
  command: 'get-instances-by-tags',
  description: 'Get Instance Ids by tag',
  builder,
  handler,
})
