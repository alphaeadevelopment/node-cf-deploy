import AWS from 'aws-sdk';

export default (profile) => {
  var credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;
}
