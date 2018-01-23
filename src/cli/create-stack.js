import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import includes from 'lodash/includes'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import { s3BucketStatus, s3CreateBucket, s3PutObject, createStack, getStackStatus } from '../api';

const builder = (yargs) => {
  yargs
    .options({
      'name': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
      'file': {
        alias: 'f',
        type: 'string',
        description: 'Path to the template description file',
        demandOption: true,
      },
      's3Bucket': {
        alias: 's',
        type: 'string',
        description: 'Name of s3 bucket',
      },
      'parameter': {
        alias: 'P',
        type: 'array',
      },
      'synchronous': {
        alias: 'S',
        description: 'Synchronous processing, script will not exit until processing complete',
        type: 'boolean',
        default: false,
      },
    })
    .coerce('file', (f) => {
      return fs.readFileSync(f, 'utf8');
    });
}

const handlerAsync = async ({ name, region, file, s3Bucket, parameter = [], synchronous }) => {
  const parameters = parameter.reduce((ps, p) => {
    const kvp = parseKeyValuePair(p, { convertNumbers: false });
    return Object.assign(ps, { [kvp.key]: kvp.value })
  }, {})
  if (!s3Bucket) {
    s3Bucket = `node-cf-deploy-${uuid('uk.alphaea.dev.node-cf-deploy', uuid.DNS)}`;
  }
  const status = await s3BucketStatus(s3Bucket);
  if (status.exists && !status.owned) {
    throw new Error(`Cannot use bucket '${s3Bucket}' as it is not owned by you`)
  }
  if (!status.exists) {
    console.log(`Creating bucket ${s3Bucket}`)
    await s3CreateBucket(s3Bucket, region);
  }
  await s3PutObject(s3Bucket, name, file);

  const arn = await createStack({
    name,
    region,
    s3Template: s3ObjectUrl({ region, bucket: s3Bucket, key: name }),
    parameters,
  });
  console.log(`Created: ${arn}`);
  if (!synchronous) return arn

  console.log('Waiting for create to complete');

  let createStatus;
  const sleep = (t) => {
    const ms = t + new Date().getTime();
    while (new Date() < ms) { }
  }
  do {
    sleep(10000);
    createStatus = await getStackStatus(name, region);
    if (createStatus === 'ROLLBACK_IN_PROGRESS') {
      console.log('Rolling back');
    }
  }
  while (!includes(['UPDATE_COMPLETE', 'CREATE_COMPLETE', 'ROLLBACK_COMPLETE'], createStatus))

  if (includes(['UPDATE_COMPLETE', 'CREATE_COMPLETE'], createStatus)) {
    return;
  }
  else {
    throw new Error('Rolled back');
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
  command: 'create-stack',
  description: 'Deploy a AWS Cloud Formation stack',
  builder,
  handler,
})
