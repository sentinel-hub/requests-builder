import React from 'react';
import { connect } from 'react-redux';
import { getMapWms, getFisStats, getCoverageWcs } from './wmsRequests';
import RequestButton from '../common/RequestButton';
import store from '../../store';
import responsesSlice from '../../store/responses';
import { calculatePixelSize } from '../common/Map/utils/bboxRatio';

const SendWmsRequest = ({ wmsState, requestState, mapState, token, mode }) => {
  const validateWmsSendRequest = () => {
    return Boolean(token && wmsState.instanceId && wmsState.layer.id);
  };

  const responseHandler = async (response) => {
    const responseUrl = URL.createObjectURL(response);
    let dimensions;
    if (requestState.heightOrRes === 'HEIGHT') {
      dimensions = calculatePixelSize(mapState.wgs84Geometry, [requestState.width, requestState.height]);
    } else if (requestState.isOnAutoRes) {
      dimensions = [requestState.width, requestState.height];
    }
    let arrayBuffer;
    if (response.type.includes('tif')) {
      arrayBuffer = await response.arrayBuffer();
    }
    store.dispatch(
      responsesSlice.actions.setImageResponse({
        src: responseUrl,
        format: response.type,
        wgs84Geometry: mapState.wgs84Geometry,
        stringRequest: undefined,
        displayResponse: true,
        mode: 'WMS',
        dimensions,
        arrayBuffer,
      }),
    );
  };

  const responseHandlerFis = (response, stringRequest) => {
    store.dispatch(responsesSlice.actions.setFisResponse({ response, stringRequest, displayResponse: true }));
    store.dispatch(responsesSlice.actions.setDisplayResponse(true));
  };

  const errorHandler = (err) => {
    store.dispatch(responsesSlice.actions.setError('Something went wrong'));
    store.dispatch(responsesSlice.actions.setDisplayResponse(true));
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
