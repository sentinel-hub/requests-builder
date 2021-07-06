import React from 'react';

import AuthHeader from '../common/AuthHeader';
import StatisticalSendRequestButton from './StatisticalSendRequestButton';

const StatisticalAuthHeader = () => {
  return (
    <div className="flex">
      <StatisticalSendRequestButton />
      <AuthHeader />
    </div>
  );
};

export default StatisticalAuthHeader;
