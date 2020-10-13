import React from 'react';
import SendRequest from './SendRequest';
import AuthHeader from '../common/AuthHeader';

const ProcessHeaderButtons = () => {
  return (
    <div className="header__buttons">
      <SendRequest />
      <AuthHeader />
    </div>
  );
};

export default ProcessHeaderButtons;
