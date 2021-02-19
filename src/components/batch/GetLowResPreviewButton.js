import React from 'react';
import ProcessRequestOverlayButton from '../common/ProcessRequestOverlayButton';
import { connect } from 'react-redux';
import { createLowResPreviewRequest } from './requests';
import { validateRequestState } from '../../utils/validator';

const GetLowResPreviewButton = ({ requestState, token }) => {
  const isValid = validateRequestState(requestState);

  return (
    <ProcessRequestOverlayButton
      className="secondary-button"
      validation={Boolean(isValid && token)}
      buttonText={'Get Low Res Preview'}
      request={createLowResPreviewRequest}
      args={[requestState, token]}
      requestState={requestState}
      skipSaving={true}
    />
  );
};

const mapStateToProps = (state) => ({
  requestState: state.request,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(GetLowResPreviewButton);
