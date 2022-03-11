import React from 'react';

import AuthHeader from '../common/AuthHeader';
import SavedRequests from '../process/Collections/SavedRequests';
import StatisticalSendRequestButton from './StatisticalSendRequestButton';

const StatisticalAuthHeader = () => {
  return (
    <div className="flex">
      <SavedRequests />
      <StatisticalSendRequestButton />
      <AuthHeader />
    </div>
  );
};

export default StatisticalAuthHeader;
