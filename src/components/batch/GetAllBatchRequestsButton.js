import React from 'react';
import { getAllBatchRequests } from './requests';
import { addAlertOnError } from './utils';

import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import store from '../../store';
import batchSlice from '../../store/batch';

const GetAllBatchRequestsButton = ({ token, setFetchedRequests, setGetAllResponse }) => {
  const responseHandler = (response) => {
    setGetAllResponse(JSON.stringify(response, null, 2));
    setFetchedRequests(
      response.member
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .map((req) => ({ ...req, isExpanded: false })),
    );
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
        style={{ marginTop: '0', marginRight: '1rem' }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(GetAllBatchRequestsButton);
