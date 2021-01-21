import React, { useState, useEffect } from 'react';
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
} from './requests';
import { Controlled as CodeMirror } from 'react-codemirror2';
import SendEditedBatchRequest from './SendEditedBatchRequest';
import { getRequestBody, dispatchChanges } from '../process/requests/parseRequest';
import { parseBatchRequest } from './parse';
import store, { alertSlice } from '../../store';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/addon/edit/matchbrackets.js');

const getRequestPreview = (request, requestState, batchState, token) => {
  switch (request) {
    case 'CREATE':
      return createBatchRequestCurlCommand(requestState, batchState, token);
    case 'ANALYSE':
      return analyseBatchRequestCurlCommand(token, batchState.selectedBatchId);
    case 'START':
      return startBatchRequestCurlCommand(token, batchState.selectedBatchId);
    case 'CANCEL':
      return cancelBatchRequestCurlCommand(token, batchState.selectedBatchId);
    case 'GETALL':
      return getAllBatchRequestsCurlCommand(token);
    case 'GETSINGLE':
      return getSingleBatchRequestCurlCommand(token, batchState.selectedBatchId);
    case 'TILES':
      return getTileStatusBatchRequestCurlCommand(token, batchState.selectedBatchId);
    default:
      return createBatchRequestCurlCommand(requestState, batchState, token);
  }
};

const BatchRequestPreview = ({ token, requestState, batchState, setFetchedRequests }) => {
  const [text, setText] = useState('');
  const [request, setRequest] = useState('CREATE');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setText(getRequestPreview(request, requestState, batchState, token));
    setIsEdited(false);
  }, [requestState, batchState, token, request]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  const handleSetRequest = (e) => {
    setRequest(e.target.value);
  };

  const handleTextChange = (editor, data, value) => {
    setText(value);
    setIsEdited(true);
  };

  const handleParseRequest = () => {
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
  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-tiny">Request Preview</h2>
      <div className="form">
        <div className="batch-select-request">
          <label className="form__label">Request</label>
          <select className="form__input" value={request} onChange={handleSetRequest}>
            <option value="CREATE">create</option>
            <option value="ANALYSE">analyse</option>
            <option value="START">start</option>
            <option value="CANCEL">cancel</option>
            <option value="GETALL">get all</option>
            <option value="GETSINGLE">get single</option>
            <option value="TILES">tiles status</option>
          </select>
        </div>
        <CodeMirror
          value={text}
          options={{
            mode: 'powershell',
            theme: 'eclipse',
            matchBrackets: true,
          }}
          onBeforeChange={handleTextChange}
          className="process-editor"
        />
        <div className="buttons-container">
          <button
            style={{ width: 'fit-content', marginLeft: '2rem' }}
            className="secondary-button"
            onClick={handleCopy}
          >
            Copy
          </button>
          {isEdited && request === 'CREATE' ? (
            <SendEditedBatchRequest setFetchedRequests={setFetchedRequests} text={text} token={token} />
          ) : null}
          {isEdited && (
            <button
              className="secondary-button"
              onClick={handleParseRequest}
              title="Parse the body of a batch request"
            >
              Parse Request
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const debounceComponent = debounceRender(BatchRequestPreview, 500);

const mapStateToProps = (store) => ({
  token: store.auth.user.access_token,
  requestState: store.request,
  batchState: store.batch,
});

export default connect(mapStateToProps)(debounceComponent);
