import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store, { requestSlice, alertSlice } from '../../store';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { DEFAULT_EVALSCRIPTS } from '../../utils/const';
import RequestButton from '../RequestButton';
import { convertEvalscript } from '../../utils/generateRequest';
import { JSHINT } from 'jshint';
import Toggle from '../Toggle';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/lint/javascript-lint');
require('codemirror/addon/lint/lint.css');
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/selection/active-line.js');

window.JSHINT = JSHINT;

const EvalscriptEditor = ({ datasource, evalscript, token, consoleValue }) => {
  const [toggledConsole, setToggledConsole] = useState(false);
  useEffect(() => {
    if (consoleValue) {
      setToggledConsole(true);
    }
  }, [consoleValue]);

  const handleChange = (code) => {
    store.dispatch(requestSlice.actions.setEvalscript(code));
  };

  const handleSetDefaultEvalscript = () => {
    const defaultEvalscript = DEFAULT_EVALSCRIPTS[datasource];
    store.dispatch(requestSlice.actions.setEvalscript(defaultEvalscript));
  };

  const convertEvalscriptResponseHandler = (response) => {
    store.dispatch(
      alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Evalscript successfully converted' }),
    );
    store.dispatch(requestSlice.actions.setEvalscript(response));
  };

  const convertEvalscriptErrorHandler = (err) => {
    store.dispatch(
      alertSlice.actions.addAlert({ type: 'WARNING', text: 'Evalscript failed to convert to V3' }),
    );
    console.error('Evalscript failed to convert to V3', err);
  };
  return (
    <>
      <div className="evalscript-title-button">
        <h2 className="heading-secondary">Evalscript</h2>
        <button
          style={{ marginRight: '2rem' }}
          className="secondary-button"
          onClick={handleSetDefaultEvalscript}
        >
          Set evalscript to default
        </button>
        <RequestButton
          buttonText="Convert Evalscript"
          request={convertEvalscript}
          args={[evalscript, datasource, token]}
          responseHandler={convertEvalscriptResponseHandler}
          errorHandler={convertEvalscriptErrorHandler}
          className="secondary-button"
          disabledTitle="Log in and use a non v3 evalscript to use this"
          validation={Boolean(token) && !evalscript.startsWith('//VERSION=3')}
        />
      </div>
      <div className="form">
        <CodeMirror
          value={evalscript}
          options={{
            mode: 'javascript',
            theme: 'eclipse',
            lint: {
              esversion: 6,
            },
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            gutters: ['CodeMirror-lint-markers'],
            styleActiveLine: true,
            extraKeys: {
              Tab: (cm) => {
                var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                cm.replaceSelection(spaces);
              },
            },
          }}
          onBeforeChange={(editor, data, value) => {
            handleChange(value);
          }}
          className="editor"
        />

        <div className="toggle-with-label u-margin-top-tiny">
          <label className="form__label" htmlFor="console">
            {toggledConsole ? 'Disable Console' : 'Enable Console'}
          </label>
          <Toggle id="console" onChange={() => setToggledConsole(!toggledConsole)} checked={toggledConsole} />
          <span
            className="info u-margin-left-small"
            title="This is not a real console, using console.log throws an error that stop the execution to return the message!"
          >
            &#8505;
          </span>
        </div>
        {toggledConsole ? (
          <div className="u-margin-top-tiny">
            <textarea
              placeholder="Use console.log on the evalscript to debug your script! Note: This is not a real console, using this will stop the execution of your script throwing an Error!"
              className="console"
              value={consoleValue}
              readOnly
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  evalscript: store.request.evalscript,
  datasource: store.request.datasource,
  token: store.auth.user.access_token,
  consoleValue: store.request.consoleValue,
});

export default connect(mapStateToProps, null)(EvalscriptEditor);
