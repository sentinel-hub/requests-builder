import React from 'react';
import axios from 'axios';
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
} from './lib/curls';
import { getRequestBody, dispatchChanges, getUrlFromCurl } from '../process/requests/parseRequest';
import { parseBatchRequest } from './parse';
import store from '../../store';
import alertSlice from '../../store/alert';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { generateProcessCurlCommand } from '../process/lib/curls';

export const sendEditedBatchRequest = (token, text, reqConfig) => {
  const getConfigHelper = (token, reqConfig) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...reqConfig,
    };
    return config;
  };

  try {
    const url = getUrlFromCurl(text);
    const config = getConfigHelper(token, reqConfig);
    const parsed = JSON.parse(getRequestBody(text));
    return axios.post(url, parsed, config);
  } catch (error) {
    return Promise.reject('Cannot parse the request');
  }
};

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
            {
              name: 'low res preview',
              value: generateProcessCurlCommand(requestState, mapState, token),
              nonToggle: true,
            },
          ]}
          canCopy
          className="process-editor"
          onParse={handleParseRequest}
          supportedParseNames={['create']}
          sendEditedRequest={(text, reqConfig) => sendEditedBatchRequest(token, text, reqConfig)}
          onSendEdited={(response) => {
            setFetchedRequests([response]);
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
