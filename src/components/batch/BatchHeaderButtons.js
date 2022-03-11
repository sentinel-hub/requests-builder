import React from 'react';
import AuthHeader from '../common/AuthHeader';
import SavedRequests from '../process/Collections/SavedRequests';

const BatchHeaderButtons = () => {
  return (
    <div className="flex pr-2">
      <SavedRequests />
      <AuthHeader />
    </div>
  );
};

export default BatchHeaderButtons;
