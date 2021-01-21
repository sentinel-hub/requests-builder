import React, { useState, useEffect } from 'react';
import { generateProcessCurlCommand, getJSONRequestBody } from './requests';
import { connect } from 'react-redux';

import debounceRender from 'react-debounce-render';
import { dispatchChanges, getRequestBody, getEvalscript } from './requests/parseRequest';
import store, { requestSlice } from '../../store';
import { getSHJSCode } from './requests/generateShjsRequest';
import { getSHPYCode } from './requests/generateShPyRequest';
import SendEditedRequestButton from './SendEditedRequestButton';

import { Controlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/mode/python/python.js');
require('codemirror/addon/edit/matchbrackets.js');

const generateRequestByMode = (mode, requestState, token) => {
  switch (mode) {
    case 'CURL':
      return generateProcessCurlCommand(requestState, token);
    case 'BODY':
      return getJSONRequestBody(requestState);
    case 'SHJS':
      return getSHJSCode(requestState, token);
    case 'SHPY':
      return getSHPYCode(requestState);
    default:
      return generateProcessCurlCommand(requestState, token);
  }
};

const getCodeMirrorMode = (mode) => {
  switch (mode) {
    case 'CURL':
      return 'powershell';
    case 'SHPY':
      return 'python';
    case 'SHJS':
      return 'javascript';
    default:
      return 'javascript';
  }
};

const RequestPreview = ({ requestState, token }) => {
  const [text, setText] = useState();
  const [edited, setEdited] = useState(false);
  const [codeMode, setCodeMode] = useState('CURL');

  useEffect(() => {
    //set textarea based on state
    setText(generateRequestByMode(codeMode, requestState, token));
    setEdited(false);
  }, [requestState, token, codeMode]);

  const handleTextChange = (editor, data, value) => {
    if (!edited) {
      setEdited(true);
    }
    setText(value);
  };

  const handleCopy = () => {
    if (codeMode === 'CURL') {
      navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleParseRequest = () => {
    try {
      // Form data
      let s;
      if (text.includes('-F ')) {
        s = '-F ';
      } else if (text.includes('--form ')) {
        s = '--form ';
      }
      if (s) {
        const splitted = text.split(s);
        const request = splitted.find((el) => el.includes('request='));
        const evalscript = splitted.find((el) => el.includes('evalscript='));

        if (request) {
          const requestBody = getRequestBody(request);
          dispatchChanges(JSON.parse(requestBody));
        }
        if (evalscript) {
          const evalBody = getEvalscript(evalscript);
          store.dispatch(requestSlice.actions.setEvalscript(evalBody));
        }
      } else {
        const body = getRequestBody(text);
        const parsed = JSON.parse(body);
        dispatchChanges(parsed);
      }
    } catch (err) {
      console.error('Error while parsing the request', err);
    }
  };

  const handleSetCodeMode = (e) => {
    setCodeMode(e.target.value);
  };

  return (
    <>
      <h2 className="heading-secondary" style={{ marginBottom: '1.3rem' }}>
        Request Preview
      </h2>
      <div className="form">
        <div className="request-preview-buttons">
          <button className="secondary-button" onClick={handleCopy}>
            Copy
          </button>

          <select value={codeMode} className="form__input" onChange={handleSetCodeMode}>
            <option value="CURL">curl</option>
            <option value="BODY">body</option>
            <option value="SHJS">sh-js</option>
            <option value="SHPY">sh-py</option>
          </select>
          {(codeMode === 'CURL' || codeMode === 'BODY') && edited ? (
            <button onClick={handleParseRequest} style={{ marginLeft: '1rem' }} className="secondary-button">
              Parse request
            </button>
          ) : null}

          {edited && token && codeMode === 'CURL' ? (
            <SendEditedRequestButton text={text} token={token} />
          ) : null}
        </div>

        <CodeMirror
          value={text}
          options={{
            mode: getCodeMirrorMode(codeMode),
            theme: 'eclipse',
            matchBrackets: true,
          }}
          onBeforeChange={handleTextChange}
          className="process-editor"
        />
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  requestState: store.request,
  token: store.auth.user.access_token,
});

const debouncedComponent = debounceRender(RequestPreview, 1000);

export default connect(mapStateToProps, null)(debouncedComponent);
