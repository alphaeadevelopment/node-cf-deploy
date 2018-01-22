import yargs from 'yargs';
import { configure } from './api'

import {
  getStackStatus, createStack, updateStack, deleteStack, getInstancesByTags, terminateInstancesByTags,
  terminateStackInstances, getStackOutput, scaleStack,
} from './cli';
import describeStack, { builder as describeStackBuilder } from './cli/describe-stack';

const c = (config) => {
  const { handler, ...otherProps } = config;
  return {
    ...otherProps,
    handler: ({ profile, ...otherArgs }) => {
      configure(profile);
      config.handler(otherArgs);
    }
  }
}

const cmd = yargs
  .command({
    command: 'deploy',
    description: 'Deploy to cloudformation stack',
    builder: (yargs) => {
      yargs
        .command({
          command: 'config-server',
          description: 'Deploy config server to AWS Cloud Formation',
          builder: describeStackBuilder,
          handler: describeStack,
        })
        .command({
          command: 'spring-boot',
          description: 'deploy spring boot server',
          builder: (yargs) => {
            yargs
              .positional('port', {
                describe: 'port to bind on',
              })
              .option('printMessage', {
                alias: 'p',
                type: 'boolean',
                default: 'true',
              });
          },
          handler: () => {
            console.log('do deploy spring boot server');
          },
        })
        .demandCommand()
    },
  })
  .command(c(getStackStatus))
  .command(c(createStack))
  .command(c(deleteStack))
  .command(c(updateStack))
  .command(c(getInstancesByTags))
  .command(c(terminateInstancesByTags))
  .command(c(terminateStackInstances))
  .command(c(getStackOutput))
  .command(c(scaleStack))
  .options({
    'profile': {
      alias: 'p',
      type: 'string',
      default: 'default',
      description: 'The AWS credentials profile to use',
    },
    'region': {
      alias: 'r',
      type: 'string',
      default: 'eu-west-1',
      description: 'The AWS region to use. Alternatively, set AWS_SDK_LOAD_CONFIG or AWS_CONFIG_FILE variables (see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html)',
    },
  })
  .demandCommand()
  .strict()
  .help()
  .argv;
