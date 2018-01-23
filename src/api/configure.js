import AWS from 'aws-sdk';

export default () => {
  const profile = process.env.AWS_PROFILE || 'default';
  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;
}
