import React from 'react';
import { getAllBatchRequests } from '../../utils/batchActions';
import { addAlertOnError } from './BatchActions';

import { connect } from 'react-redux';
import RequestButton from '../RequestButton';
import store, { batchSlice } from '../../store';

const GetAllBatchRequestsButton = ({ token, setFetchedRequests }) => {
  const responseHandler = (response) => {
    setFetchedRequests(response.member.sort((a, b) => new Date(b.created) - new Date(a.created)));
    store.dispatch(batchSlice.actions.setExtraInfo(''));
  };
  return (
    <div>
      <RequestButton
        validation={!!token}
        disabledTitle="Log in to use this"
        className="secondary-button"
        buttonText="Get All Batch Requests"
        responseHandler={responseHandler}
        errorHandler={addAlertOnError}
        request={getAllBatchRequests}
        args={[token]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(GetAllBatchRequestsButton);
