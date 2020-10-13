import React from 'react';
import { connect } from 'react-redux';
import { generateAxiosRequest } from './requests';
import CancelablePopUpRequestButton from '../common/CancelablePopUpRequestButton';
import store, { requestSlice, responsesSlice } from '../../store';
import { validateRequestState } from '../../utils/validator';

const debugError = (responseString) => {
  return responseString.includes('Failed to evaluate script!') && responseString.includes(' Error: ');
};

const getDebugError = (responseString) => {
  const startIndex = responseString.indexOf(' Error: ') + 7;
  const endIndex = responseString.indexOf('throw new Error');
  let debugMessage = responseString.substring(startIndex, endIndex);
  return debugMessage.trim();
};

export const createFileReader = () => {
  const fr = new FileReader();
  fr.onload = function () {
    const resultString = fr.result;
    const parsed = JSON.parse(resultString);
    if (debugError(resultString)) {
      store.dispatch(requestSlice.actions.setConsoleValue(getDebugError(resultString)));
    } else {
      store.dispatch(responsesSlice.actions.setError(parsed.error.message));
      store.dispatch(responsesSlice.actions.setShow(true));
    }
  };
  return fr;
};

const SendRequest = ({ token, requestState }) => {
  const isValid = validateRequestState(requestState);

  return (
    <div>
      <CancelablePopUpRequestButton
        className={`button`}
        buttonText="Send Request"
        request={generateAxiosRequest}
        args={[requestState, token]}
        validation={Boolean(isValid && token)}
        requestState={requestState}
        useShortcut={true}
      />
    </div>
  );
};

const mapStateToProps = (store) => ({
  token: store.auth.user.access_token,
  requestState: store.request,
});

export default connect(mapStateToProps)(SendRequest);
