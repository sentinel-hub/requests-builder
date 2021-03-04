import React from 'react';
import { connect } from 'react-redux';
import { getMapWms, getFisStats, getCoverageWcs } from './wmsRequests';
import RequestButton from '../common/RequestButton';
import store from '../../store';
import responsesSlice from '../../store/responses';

const SendWmsRequest = ({ wmsState, requestState, mapState, token, mode }) => {
  const validateWmsSendRequest = () => {
    return Boolean(token && wmsState.instanceId && wmsState.layer.id);
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

  const request = (() => {
    switch (mode) {
      case 'WMS':
        return getMapWms;
      case 'FIS':
        return getFisStats;
      case 'WCS':
        return getCoverageWcs;
      default:
        return getMapWms;
    }
  })();

  return (
    <RequestButton
      buttonText="Send Request"
      className="button"
      request={request}
      args={[wmsState, requestState, mapState, token]}
      validation={validateWmsSendRequest()}
      responseHandler={mode === 'WMS' || mode === 'WCS' ? responseHandler : responseHandlerFis}
      errorHandler={errorHandler}
      useShortcut={true}
    />
  );
};

const mapStateToProps = (state) => ({
  wmsState: state.wms,
  requestState: state.request,
  mapState: state.map,
  token: state.auth.user.access_token,
  mode: state.wms.mode,
});

export default connect(mapStateToProps)(SendWmsRequest);
