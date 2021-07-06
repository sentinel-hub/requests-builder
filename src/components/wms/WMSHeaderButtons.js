import React from 'react';
import SendWmsRequest from './SendWmsRequest';
import AuthHeader from '../common/AuthHeader';

const WMSHeaderButtons = () => {
  return (
    <div className="flex">
      <SendWmsRequest />
      <AuthHeader />
    </div>
  );
};

export default WMSHeaderButtons;
