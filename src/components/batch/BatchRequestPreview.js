import React from 'react';
import debounceRender from 'react-debounce-render';
import { connect } from 'react-redux';
import omit from 'lodash.omit';
import {
  createBatchRequestCurlCommand,
  analyseBatchRequestCurlCommand,
  startBatchRequestCurlCommand,
  cancelBatchRequestCurlCommand,
  getAllBatchRequestsCurlCommand,
  getSingleBatchRequestCurlCommand,
  getTileStatusBatchRequestCurlCommand,
  sendEditedBatchRequest,
} from './requests';
import { getRequestBody, dispatchChanges } from '../process/requests/parseRequest';
import { parseBatchRequest } from './parse';
import store from '../../store';
import alertSlice from '../../store/alert';
import batchSlice from '../../store/batch';
import CommonRequestPreview from '../common/CommonRequestPreview';

const handleParseRequest = (text) => {
  try {
    const request = JSON.parse(getRequestBody(text));
    if (request.processRequest) {
      dispatchChanges(request.processRequest);
    }
    parseBatchRequest(omit(request, ['processRequest']));
  } catch (err) {
    store.dispatch(
      alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong parsing the request.' }),
    );
    console.error('Something went wrong parsing the request', err);
  }
};

const BatchRequestPreview = ({
  token,
  requestState,
  mapState,
  batchState,
  setFetchedRequests,
  createResponse,
  getAllResponse,
  singleResponse,
  tilesResponse,
}) => {
  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-tiny">Request Preview</h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              name: 'create',
              value: createBatchRequestCurlCommand(requestState, batchState, mapState, token),
              toggledValue: createResponse,
            },
            {
              name: 'analyse',
              value: analyseBatchRequestCurlCommand(token, batchState.selectedBatchId),
              nonToggle: true,
            },
            {
              name: 'start',
              value: startBatchRequestCurlCommand(token, batchState.selectedBatchId),
              nonToggle: true,
            },
            {
              name: 'cancel',
              value: cancelBatchRequestCurlCommand(token, batchState.selectedBatchId),
              nonToggle: true,
            },
            {
              name: 'get all',
              value: getAllBatchRequestsCurlCommand(token),
              toggledValue: getAllResponse,
            },
            {
              name: 'get single',
              value: getSingleBatchRequestCurlCommand(token, batchState.selectedBatchId),
              toggledValue: singleResponse,
            },
            {
              name: 'tiles status',
              value: getTileStatusBatchRequestCurlCommand(token, batchState.selectedBatchId),
              toggledValue: tilesResponse,
            },
          ]}
          canCopy
          className="process-editor"
          onParse={handleParseRequest}
          supportedParseNames={['create']}
          sendEditedRequest={(text, reqConfig) => sendEditedBatchRequest(token, text, reqConfig)}
          onSendEdited={(response) => {
            setFetchedRequests([response]);
            store.dispatch(batchSlice.actions.setSelectedBatchId(response['id']));
          }}
          supportedSendEditedNames={['create']}
          id="batch-req-preview"
        />
      </div>
    </>
  );
};

const debouncedComponent = debounceRender(BatchRequestPreview, 500);

const mapStateToProps = (store) => ({
  token: store.auth.user.access_token,
  requestState: store.request,
  mapState: store.map,
  batchState: store.batch,
});

export default connect(mapStateToProps)(debouncedComponent);
