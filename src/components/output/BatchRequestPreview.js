import React, { useState, useEffect } from 'react';
import debounceRender from 'react-debounce-render';
import { connect } from 'react-redux';
import {
  createBatchRequestCurlCommand,
  analyseBatchRequestCurlCommand,
  startBatchRequestCurlCommand,
  cancelBatchRequestCurlCommand,
  getAllBatchRequestsCurlCommand,
  getSingleBatchRequestCurlCommand,
  getTileStatusBatchRequestCurlCommand,
} from '../../utils/batchActions';
import { Controlled as CodeMirror } from 'react-codemirror2';
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

const BatchRequestPreview = ({ token, requestState, batchState }) => {
  const [text, setText] = useState('');
  const [request, setRequest] = useState('CREATE');

  useEffect(() => {
    setText(getRequestPreview(request, requestState, batchState, token));
  }, [requestState, batchState, token, request]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-tiny">Request Preview</h2>
      <div className="form">
        <div className="batch-select-request">
          <label className="form__label">Request</label>
          <select className="form__input" value={request} onChange={(e) => setRequest(e.target.value)}>
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
          onBeforeChange={(editor, data, value) => setText(value)}
          className="process-editor"
        />
        <button
          style={{ width: 'fit-content', marginLeft: '2rem' }}
          className="secondary-button"
          onClick={handleCopy}
        >
          Copy
        </button>
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
