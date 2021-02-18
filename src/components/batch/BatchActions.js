import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import alertSlice from '../../store/alert';
import batchSlice from '../../store/batch';
import AnalyseBatchRequestButton from './AnalyseBatchRequestButton';
import StartBatchRequestButton from './StartBatchRequestButton';
import CancelBatchRequestButton from './CancelBatchRequestButton';
import GetSingleRequestButton from './GetSingleRequestButton';
import RestartPartialRequestButton from './RestartPartialRequestButton';

export const addAlertOnError = (error, message) => {
  if (error.response?.status === 403) {
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: "You don't have enough permissions to use this",
      }),
    );
  } else if (message) {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: message }));
    console.error(error);
  } else {
    try {
      const err = error.response.data.error;
      let errorMsg = err.message;
      if (err.errors) {
        errorMsg += err.errors.map((subErr) => (subErr.violation ? '\n' + subErr.violation : ''));
      }
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: errorMsg }));
    } catch (exc) {
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
      console.error(error);
    }
  }
};

//check if valid uuid.
const checkValidId = (id) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

export const batchIdValidation = (token, batchId) => token && checkValidId(batchId);

const BatchActions = ({ selectedBatchId, setFetchedRequests, setSingleResponse }) => {
  const handleBatchIdChange = (e) => {
    store.dispatch(batchSlice.actions.setSelectedBatchId(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-top-small">Batch Actions</h2>
      <div className="form">
        <label htmlFor="batch-request-id" className="form__label u-margin-top-tiny">
          Batch Request Id
        </label>
        <input
          id="batch-request-id"
          onChange={handleBatchIdChange}
          className="form__input"
          type="text"
          value={selectedBatchId}
        />
        <div className="buttons-container">
          <AnalyseBatchRequestButton />
          <StartBatchRequestButton />
          <CancelBatchRequestButton />
          <RestartPartialRequestButton />
          <GetSingleRequestButton
            setFetchedRequests={setFetchedRequests}
            setSingleResponse={setSingleResponse}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedBatchId: state.batch.selectedBatchId,
});

export default connect(mapStateToProps)(BatchActions);
