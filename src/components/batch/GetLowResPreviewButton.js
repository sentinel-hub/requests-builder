import React from 'react';
import ProcessRequestOverlayButton from '../common/ProcessRequestOverlayButton';
import { connect } from 'react-redux';
import { createLowResPreviewRequest } from './requests';
import { validateRequestState } from '../../utils/validator';

const GetLowResPreviewButton = ({ requestState, mapState, token }) => {
  const isValid = validateRequestState(requestState);

  return (
    <ProcessRequestOverlayButton
      className="secondary-button"
      validation={Boolean(isValid && token)}
      buttonText={'Get Low Res Preview'}
      request={createLowResPreviewRequest}
      args={[requestState, mapState, token]}
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
