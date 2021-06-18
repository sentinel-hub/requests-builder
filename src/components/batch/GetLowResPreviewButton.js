import React from 'react';
import ProcessRequestOverlayButton from '../common/ProcessRequestOverlayButton';
import { connect } from 'react-redux';
import { validateRequestState } from '../../utils/validator';
import ProcessResource from '../../api/process/ProcessResource';
import { getRequestObject } from '../../api/process/utils';

const GetLowResPreviewButton = ({ requestState, mapState, token }) => {
  const isValid = validateRequestState(requestState);

  return (
    <ProcessRequestOverlayButton
      className="secondary-button"
      validation={Boolean(isValid && token)}
      buttonText={'Get Low Res Preview'}
      request={ProcessResource.stateRequest(requestState)}
      args={[getRequestObject(requestState, mapState)]}
      reqConfig={{ responseType: 'blob' }}
      requestState={requestState}
      skipSaving={true}
      wgs84Geometry={mapState.wgs84Geometry}
    />
  );
};

const mapStateToProps = (state) => ({
  requestState: state.request,
  mapState: state.map,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(GetLowResPreviewButton);
