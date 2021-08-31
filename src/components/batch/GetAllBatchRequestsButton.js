import React from 'react';
import { addAlertOnError } from './lib/utils';

import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

const getAllBatchRequests = (batchDeployment) => async (_, reqConfig) => {
  let res = await BatchResource.getOrders(batchDeployment)(null, reqConfig);
  let requests = res.data.data;
  while (res.data.links.next) {
    res = await BatchResource.getNextOrders(res.data.links.next)(null, reqConfig);
    requests = requests.concat(res.data.data);
  }
  return new Promise((resolve, reject) => {
    resolve({ data: { member: requests } });
  });
};

const GetAllBatchRequestsButton = ({
  token,
  setFetchedRequests,
  setGetAllResponse,
  batchSelectedDeployment,
}) => {
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
    <RequestButton
      validation={!!token}
      disabledTitle="Log in to use this"
      className="secondary-button"
      buttonText="Get All Batch Requests"
      responseHandler={responseHandler}
      errorHandler={addAlertOnError}
      request={getAllBatchRequests(batchSelectedDeployment)}
      args={[]}
      additionalClassNames={['mt-0', 'mr-2', 'wrapped']}
    />
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(GetAllBatchRequestsButton);
