import React from 'react';
import { connect } from 'react-redux';
import { getMapWms, getFisStats } from './wmsRequests';
import RequestButton from '../common/RequestButton';
import store, { responsesSlice } from '../../store';

const SendWmsRequest = ({ wmsState, requestState, token, mode }) => {
  const validateWmsSendRequest = () => {
    return Boolean(token && wmsState.instanceId && wmsState.layerId);
  };

  const responseHandler = (response) => {
    const responseUrl = URL.createObjectURL(response);
    store.dispatch(
      responsesSlice.actions.setResponse({
        src: responseUrl,
      }),
    );
  };

  const responseHandlerFis = (response) => {
    const s = JSON.stringify(response, null, 2);
    store.dispatch(responsesSlice.actions.setFisResponse(s));
    store.dispatch(responsesSlice.actions.setShow(true));
  };

  const errorHandler = (err) => {
    store.dispatch(responsesSlice.actions.setError('Something went wrong'));
    store.dispatch(responsesSlice.actions.setShow(true));
    console.error('Something went wrong', err);
  };

  return (
    <div>
      <RequestButton
        buttonText="Send Request"
        className="button"
        request={mode === 'WMS' ? getMapWms : getFisStats}
        args={[wmsState, requestState, token]}
        validation={validateWmsSendRequest()}
        responseHandler={mode === 'WMS' ? responseHandler : responseHandlerFis}
        errorHandler={errorHandler}
        useShortcut={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  wmsState: state.wms,
  requestState: state.request,
  token: state.auth.user.access_token,
  mode: state.wms.mode,
});

export default connect(mapStateToProps)(SendWmsRequest);
