import React from 'react';
import RequestButton from '../common/RequestButton';
import { sendCatalogEditedRequest } from './requests';
import { catalogErrorHandler } from './CatalogSendRequestButton';

const CatalogSendEditedRequest = ({ text, token, setResults }) => {
  const responseHandler = (response) => {
    setResults((res) => ({
      ...res,
      results: response.features,
    }));
  };
  return (
    <>
      <RequestButton
        buttonText="Send Edited Request"
        request={sendCatalogEditedRequest}
        args={[text, token]}
        className="secondary-button"
        disabledTitle="Log in to use this"
        responseHandler={responseHandler}
        errorHandler={catalogErrorHandler}
        validation={Boolean(token)}
      />
    </>
  );
};

export default CatalogSendEditedRequest;
