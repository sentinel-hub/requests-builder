import React from 'react';

const RequestPropsButton = ({ request, isFetching, disabled, content, className = '' }) => {
  return (
    <button
      onClick={request}
      disabled={disabled || isFetching}
      className={`secondary-button ${isFetching ? 'secondary-button--cancel' : ''} ${className}`}
    >
      {!isFetching ? content : 'Fetching...'}
    </button>
  );
};

export default RequestPropsButton;
