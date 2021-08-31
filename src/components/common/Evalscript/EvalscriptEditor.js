import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { CUSTOM, datasourceToCustomRepoLink, getDefaultEvalscript } from '../../../utils/const/const';
import { JSHINT } from 'jshint';
import Toggle from '../Toggle';
import DataProductSelection from './DataProductSelection';
import Tooltip from '../Tooltip/Tooltip';
import EvalscriptGui from './EvalscriptGui/index';
import { addWarningAlert } from '../../../store/alert';

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

const canUseEvalscriptGui = (dataCollection, isOnDatafusion) => !isOnDatafusion && dataCollection !== CUSTOM;

const EvalscriptEditor = ({
  dataCollection,
  mode,
  evalscript,
  token,
  consoleValue,
  className,
  isOnDatafusion,
}) => {
  const [toggledConsole, setToggledConsole] = useState(false);
  const [usingEvalscriptGui, setUsingEvalscriptGui] = useState(false);

  useEffect(() => {
    if (consoleValue) {
      setToggledConsole(true);
    }
  }, [consoleValue]);

  useEffect(() => {
    if (usingEvalscriptGui && !canUseEvalscriptGui(dataCollection, isOnDatafusion)) {
      setUsingEvalscriptGui(false);
      addWarningAlert('Evalscript GUI generation does not support BYOC or Data Fusion');
    }
  }, [usingEvalscriptGui, dataCollection, isOnDatafusion]);

  const handleTextChange = (editor, data, code) => {
    store.dispatch(requestSlice.actions.setEvalscript(code));
  };

  const handleSetDefaultEvalscript = () => {
    const defaultEvalscript = getDefaultEvalscript(mode, dataCollection);
    store.dispatch(requestSlice.actions.setEvalscript(defaultEvalscript));
  };

  const handleToggleConsole = () => {
    setToggledConsole(!toggledConsole);
  };

  return (
    <>
      <div className="flex items-center mb-2">
        <h2 className="heading-secondary mr-2">Evalscript</h2>
        <button
          className="secondary-button mr-2 wrapped"
          onClick={handleSetDefaultEvalscript}
          title="This will try to set the evalscript to a data-source default one"
        >
          Set to default evalscript
        </button>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text underline wrapped"
          href={datasourceToCustomRepoLink(dataCollection)}
        >
          Custom scripts repo
        </a>
      </div>

      <div className="form">
        {!usingEvalscriptGui && <DataProductSelection token={token} dataCollection={dataCollection} />}

        {canUseEvalscriptGui(dataCollection, isOnDatafusion) && (
          <div className="flex">
            <label className="form__label cursor-pointer mr-2 mb-3" htmlFor="evalscript-gui">
              Use Evalscript GUI
            </label>
            <Toggle
              checked={usingEvalscriptGui}
              onChange={() => setUsingEvalscriptGui(!usingEvalscriptGui)}
              id="evalscript-gui"
            />
          </div>
        )}

        {usingEvalscriptGui ? (
          <EvalscriptGui setUsingEvalscriptGui={setUsingEvalscriptGui} />
        ) : (
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
            onBeforeChange={handleTextChange}
            className={
              className
                ? className
                : `process-editor process-editor--evalscript ${
                    !toggledConsole ? 'process-editor--console' : ''
                  }`
            }
          />
        )}

        <div className="flex items-center mb-2 mt-1">
          <label className="form__label cursor-pointer mr-2" htmlFor="console">
            {toggledConsole ? 'Disable Console' : 'Enable Console'}
          </label>
          <Toggle id="console" onChange={handleToggleConsole} checked={toggledConsole} />
          <Tooltip
            direction="right"
            content="This is not a real console, using console.log throws an error that stop the execution to return the message!"
            infoStyles={{ marginLeft: '1rem' }}
          />
        </div>

        {toggledConsole ? (
          <div className="mt-1">
            <textarea
              placeholder="Use console.log on the evalscript to debug your script! Note: This is not a real console, using this will stop the execution of your script throwing an Error!"
              className="w-full h-12 py-2 px-4"
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
  dataCollection: store.request.dataCollections[0].type,
  token: store.auth.user.access_token,
  consoleValue: store.request.consoleValue,
  mode: store.request.mode,
  isOnDatafusion: store.request.dataCollections.length > 1,
});

export default connect(mapStateToProps, null)(EvalscriptEditor);
