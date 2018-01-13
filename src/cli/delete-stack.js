import AWS from 'aws-sdk';
import fs from 'fs';
import uuid from 'uuid/v5';
import includes from 'lodash/includes'

import { deleteStack, getStackStatus } from '../api';
import { sleep } from '../utils';

const builder = (yargs) => {
  yargs
    .options({
      'name': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
      'synchronous': {
        alias: 'S',
        description: 'Synchronous processing, script will not exit until processing complete',
        type: 'boolean',
        default: false,
      },
    });
}

const handlerAsync = async ({ name, region, synchronous }) => {

  await deleteStack({
    name,
    region,
  });
  if (!synchronous) return;

  console.log('Waiting for delete to complete');

  let deleteStatus;
  do {
    sleep(5000);
    try {
      deleteStatus = await getStackStatus(name, region)
    } catch (err) {
      if (err.statusCode !== 400) {
        throw err;
      }
      deleteStatus = 'DELETE_COMPLETE';
    }
  }
  while (deleteStatus !== 'DELETE_COMPLETE')

  if ('DELETE_COMPLETE' === deleteStatus) {
    return;
  }
  else {
    throw new Error('Failed to delete');
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
  command: 'delete-stack',
  description: 'Delete a AWS Cloud Formation stack',
  builder,
  handler,
})
