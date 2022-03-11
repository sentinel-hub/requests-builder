import React from 'react';
import SendRequest from './SendRequest';
import AuthHeader from '../common/AuthHeader';
import SavedRequests from './Collections/SavedRequests';

const ProcessHeaderButtons = () => {
  return (
    <div className="flex flex-col py-2 lg:flex-row lg:py-0">
      <AuthHeader />
      <SavedRequests />
      <SendRequest />
    </div>
  );
};

export default ProcessHeaderButtons;
