import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import {
  getDeleteOrderTpdiCurlCommand,
  getCreateViaProductsTpdiCurlCommand,
  getCreateViaDataFilterTpdiCurlCommand,
  getSearchTpdiCurlCommand,
  getAllOrdersTpdiCurlCommand,
  getConfirmOrderTpdiCurlCommand,
} from './generateTPDIRequests';
import debounceRender from 'react-debounce-render';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/addon/edit/matchbrackets.js');

const getRequestPreview = (request, state) => {
  if (request === 'PRODUCTS') {
    return getCreateViaProductsTpdiCurlCommand(state);
  }
  if (request === 'DATAFILTER') {
    return getCreateViaDataFilterTpdiCurlCommand(state);
  }
  if (request === 'SEARCH') {
    return getSearchTpdiCurlCommand(state);
  }
  if (request === 'GET') {
    return getAllOrdersTpdiCurlCommand(state);
  }
  if (request === 'CONFIRM') {
    return getConfirmOrderTpdiCurlCommand(state);
  }
  if (request === 'DELETE') {
    return getDeleteOrderTpdiCurlCommand(state);
  }
};

const TPDIRequestPreview = ({ state }) => {
  const [text, setText] = useState('');
  const [request, setRequest] = useState('PRODUCTS');

  useEffect(() => {
    setText(getRequestPreview(request, state));
  }, [state, request]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  const handleSetRequest = (e) => {
    setRequest(e.target.value);
  };
  const handleTextChange = (editor, data, value) => {
    setText(value);
  };

  return (
    <>
      <h2 className="heading-secondary">Request Preview</h2>
      <div className="form">
        <div className="tpdi-request-preview-select-request">
          <label htmlFor="tpdi-request-preview" className="form__label">
            Request
          </label>
          <select
            id="tpdi-request-preview"
            value={request}
            onChange={handleSetRequest}
            className="form__input"
          >
            <option value="DATAFILTER">create with datafilter</option>
            <option value="PRODUCTS">create with product id</option>
            <option value="SEARCH">search</option>
            <option value="GET">get all orders</option>
            <option value="CONFIRM">confirm order</option>
            <option value="DELETE">delete order</option>
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
        <div className="tpdi-request-preview-buttons">
          <button className="secondary-button" onClick={handleCopy}>
            Copy
          </button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  state,
});

const debouncedComponent = debounceRender(TPDIRequestPreview, 500);

export default connect(mapStateToProps)(debouncedComponent);
