import React from 'react';
import CancelablePopUpRequestButton from '../common/CancelablePopUpRequestButton';
import { connect } from 'react-redux';
import { createLowResPreviewRequest } from './requests';
import { validateRequestState } from '../../utils/validator';

const GetLowResPreviewButton = ({ requestState, token }) => {
  const isValid = validateRequestState(requestState);

  return (
    <div>
      <CancelablePopUpRequestButton
        className="secondary-button"
        validation={Boolean(isValid && token)}
        buttonText={'Get Low Res Preview'}
        request={createLowResPreviewRequest}
        args={[requestState, token]}
        requestState={requestState}
        useShortcut={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  requestState: state.request,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(GetLowResPreviewButton);
