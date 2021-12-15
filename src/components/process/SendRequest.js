import React from 'react';
import { connect } from 'react-redux';
import ProcessRequestOverlayButton from '../common/ProcessRequestOverlayButton';
import store from '../../store';
import responsesSlice from '../../store/responses';
import requestSlice, { isInvalidDatafusionState } from '../../store/request';
import { validateRequestState } from '../../utils/validator';
import ProcessResource from '../../api/process/ProcessResource';
import { getRequestObject } from '../../api/process/utils';

const debugError = (responseString) => {
  return responseString.includes('Failed to evaluate script!') && responseString.includes(' Error: ');
};

const getDebugError = (responseString) => {
  const startIndex = responseString.indexOf(' Error: ') + 7;
  const endIndex = responseString.indexOf('throw new Error');
  let debugMessage = responseString.substring(startIndex, endIndex);
  return debugMessage.trim();
};

const getErrorFromProcessApi = (error) => {
  let errorMsg = error.error.message;
  if (error.error.errors && error.error.errors.length > 0) {
    for (let err of error.error.errors) {
      if (err.parameter && err.violation) {
        errorMsg += `\nparameter ${err.parameter} ${err.violation}\n`;
      }
    }
  }
  return errorMsg;
};

export const createFileReader = () => {
  const fr = new FileReader();
  fr.onload = function () {
    const resultString = fr.result;
    const parsed = JSON.parse(resultString);
    if (debugError(resultString)) {
      store.dispatch(requestSlice.actions.setConsoleValue(getDebugError(resultString)));
    } else {
      store.dispatch(responsesSlice.actions.setError(getErrorFromProcessApi(parsed)));
      store.dispatch(responsesSlice.actions.setDisplayResponse(true));
    }
  };
  return fr;
};

const SendRequest = ({ token, requestState, mapState }) => {
  const isValid = validateRequestState(requestState);
  const isInvalidDatafusion = isInvalidDatafusionState({
    dataCollections: requestState.dataCollections,
    appMode: requestState.mode,
  });
  return (
    <ProcessRequestOverlayButton
      className="primary-button"
      additionalClassNames={['mr-2 mb-2 lg:mb-0']}
      buttonText={!token ? 'Log in to send a request' : 'Send request'}
      request={ProcessResource.stateRequest(requestState)}
      args={[getRequestObject(requestState, mapState)]}
      validation={Boolean(isValid && token && !isInvalidDatafusion)}
      requestState={requestState}
      skipSaving={false}
      wgs84Geometry={mapState.wgs84Geometry}
      reqConfig={{ responseType: 'blob' }}
      useShortcut
    />
  );
};

const mapStateToProps = (store) => ({
  token: store.auth.user.access_token,
  requestState: store.request,
  mapState: store.map,
});

export default connect(mapStateToProps)(SendRequest);
