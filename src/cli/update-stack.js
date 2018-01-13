import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5'

import { stripQuotes, parseKeyValuePair, s3ObjectUrl } from '../utils';
import { s3BucketStatus, s3CreateBucket, s3PutObject, updateStack } from '../api';

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
      's3-bucket': {
        alias: 's',
        type: 'string',
        description: 'Name of s3 bucket',
      },
      'parameter': {
        alias: 'P',
        type: 'array',
      }
    })
    .coerce('file', (f) => {
      return fs.readFileSync(f, 'utf8');
    });
}

const handlerAsync = async ({ name, region, file, s3Bucket, parameter }) => {
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


  const arn = await updateStack({
    name,
    region,
    s3Template: s3ObjectUrl({ region, bucket: s3Bucket, key: name }),
    parameters,
  });
  return data
}

const handler = (args) => {
  handlerAsync(args)
    .then(result => console.log(result))
    .catch(err => console.log(err.message));
}

export default ({
  command: 'update-stack',
  description: 'Update a AWS Cloud Formation stack',
  builder,
  handler,
})
