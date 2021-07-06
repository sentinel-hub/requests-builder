import React from 'react';
import SendRequest from './SendRequest';
import AuthHeader from '../common/AuthHeader';

const ProcessHeaderButtons = () => {
  return (
    <div className="flex flex-col py-2 lg:flex-row lg:py-0">
      <SendRequest />
      <AuthHeader />
    </div>
  );
};

export default ProcessHeaderButtons;
