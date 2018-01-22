import AWS from 'aws-sdk';

import describeStacks from './describe-stacks';
import { stripQuotes } from '../utils';

export default (AutoScalingGroupName, MinSize, MaxSize, DesiredCapacity, region) => {
  return new Promise((res, rej) => {
    const autoscaling = new AWS.AutoScaling({ region });

    var params = {
      AutoScalingGroupName,
      MaxSize,
      MinSize,
      DesiredCapacity,
    };
    autoscaling.updateAutoScalingGroup(params, function (err, data) {
      if (err) rej(err);
      else res(data);
    });
  });
}
