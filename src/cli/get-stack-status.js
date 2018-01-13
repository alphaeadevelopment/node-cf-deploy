import AWS from 'aws-sdk';
import { getStackStatus } from '../api'

const builder = (yargs) => {
  yargs
    .options({
      'name': {
        alias: 'n',
        type: 'string',
        description: 'The name or the unique stack ID that is associated with the stack',
        demandOption: true,
      },
    });
}

const handler = ({ name, region }) => {
  getStackStatus(name, region)
    .then(data => console.log(data))
    .catch(err => console.log(err.message));
}

export default ({
  command: 'get-stack-status',
  description: 'Fetch status of AWS Cloud Formation stack',
  builder,
  handler,
})
