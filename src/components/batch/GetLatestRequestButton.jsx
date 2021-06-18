import React from 'react';
import { connect } from 'react-redux';

import { addAlertOnError, isFinishedStatus, isRunningStatus } from './lib/utils';
import RequestButton from '../common/RequestButton';
import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

const GetLatestRequestButton = ({ token, setFetchedRequests, handleExpandContainer }) => {
  const responseHandler = (response) => {
    const sortedAndExpanded = response.data
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .map((req) => ({ ...req, isExpanded: true }));
    const latest = sortedAndExpanded[0];

    // open appropriate container
    const { status } = latest;
    if (isFinishedStatus(status)) {
      handleExpandContainer(2)(true);
    } else if (isRunningStatus(status)) {
      handleExpandContainer(1)(true);
    } else {
      handleExpandContainer(0)(true);
    }

    setFetchedRequests([latest]);
    store.dispatch(batchSlice.actions.setExtraInfo(''));
  };
  return (
    <RequestButton
      validation={!!token}
      disabledTitle="Log in to use this"
      className="secondary-button"
      buttonText="Get Latest"
      responseHandler={responseHandler}
      errorHandler={addAlertOnError}
      request={BatchResource.getLatestOrders}
      args={[]}
      style={{ marginTop: '0', marginRight: '1rem' }}
    />
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(GetLatestRequestButton);
