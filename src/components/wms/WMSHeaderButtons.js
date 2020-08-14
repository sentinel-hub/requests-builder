import React from 'react';
import SendWmsRequest from './SendWmsRequest';
import AuthHeader from '../AuthHeader';

const WMSHeaderButtons = () => {
  return (
    <div className="header__buttons">
      <SendWmsRequest />
      <AuthHeader />
    </div>
  );
};

export default WMSHeaderButtons;
