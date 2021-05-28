import React from 'react';
import { connect } from 'react-redux';
import ProcessRequestOverlayButton from '../common/ProcessRequestOverlayButton';
import store from '../../store';
import responsesSlice from '../../store/responses';
import requestSlice from '../../store/request';
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

export const createFileReader = () => {
  const fr = new FileReader();
  fr.onload = function () {
    const resultString = fr.result;
    const parsed = JSON.parse(resultString);
    if (debugError(resultString)) {
      store.dispatch(requestSlice.actions.setConsoleValue(getDebugError(resultString)));
    } else {
      store.dispatch(responsesSlice.actions.setError(parsed.error.message));
      store.dispatch(responsesSlice.actions.setDisplayResponse(true));
    }
  };
  return fr;
};

const SendRequest = ({ token, requestState, mapState }) => {
  const isValid = validateRequestState(requestState);

  return (
    <ProcessRequestOverlayButton
      className="button"
      buttonText="Send Request"
      request={ProcessResource.stateRequest(requestState)}
      args={[getRequestObject(requestState, mapState), { responseType: 'blob' }]}
      validation={Boolean(isValid && token)}
      requestState={requestState}
      skipSaving={false}
      wgs84Geometry={mapState.wgs84Geometry}
    />
  );
};

const mapStateToProps = (store) => ({
  token: store.auth.user.access_token,
  requestState: store.request,
  mapState: store.map,
});

export default connect(mapStateToProps)(SendRequest);
