import React from 'react';
import SendWmsRequest from './SendWmsRequest';
import AuthHeader from '../common/AuthHeader';

const WMSHeaderButtons = () => {
  return (
    <div className="header__buttons">
      <SendWmsRequest />
      <AuthHeader />
    </div>
  );
};

export default WMSHeaderButtons;
