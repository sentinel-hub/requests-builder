import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { DEFAULT_EVALSCRIPTS, CUSTOM, DATAFUSION } from '../../../utils/const';
import { fetchDataProducts } from './utils';
import { JSHINT } from 'jshint';
import Toggle from '../Toggle';
import DataProductSelection from './DataProductSelection';
import Axios from 'axios';

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

const canUseDataProducts = (datasource, token) => token && datasource !== CUSTOM && datasource !== DATAFUSION;

const EvalscriptEditor = ({ datasource, evalscript, token, consoleValue, className }) => {
  const [toggledConsole, setToggledConsole] = useState(false);
  const [useDataProduct, setUseDataProduct] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [isFetchingDataProducts, setIsFetchingDataProducts] = useState(false);

  const fetchAndSetDataProducts = useCallback(async (datasource, token, reqConfig) => {
    try {
      setIsFetchingDataProducts(true);
      const dataproducts = await fetchDataProducts(datasource, token, reqConfig);
      setDataProducts(dataproducts);
      setIsFetchingDataProducts(false);
    } catch (error) {
      if (!Axios.isCancel(error)) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (consoleValue) {
      setToggledConsole(true);
    }
  }, [consoleValue]);

  // Fetch Data Products if needed.
  useEffect(() => {
    let source = Axios.CancelToken.source();
    if (useDataProduct && dataProducts.length === 0 && canUseDataProducts(datasource, token)) {
      fetchAndSetDataProducts(datasource, token, { cancelToken: source.token });
    }
    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [datasource, useDataProduct, token, dataProducts.length, fetchAndSetDataProducts]);

  // Reset Data Products when datasource changes.
  useEffect(() => {
    setDataProducts([]);
  }, [datasource]);

  const handleTextChange = (editor, data, code) => {
    store.dispatch(requestSlice.actions.setEvalscript(code));
  };

  const handleSetDefaultEvalscript = () => {
    const defaultEvalscript = DEFAULT_EVALSCRIPTS[datasource];
    store.dispatch(requestSlice.actions.setEvalscript(defaultEvalscript));
  };

  const handleUseDataProductChange = () => {
    setUseDataProduct(!useDataProduct);
  };

  const handleToggleConsole = () => {
    setToggledConsole(!toggledConsole);
  };

  return (
    <>
      <div className="evalscript-title-button">
        <h2 className="heading-secondary">Evalscript</h2>
        <button
          style={{ marginRight: '2rem' }}
          className="secondary-button"
          onClick={handleSetDefaultEvalscript}
          title="This will try to set the evalscript to a data-source default one"
        >
          Set evalscript to default
        </button>
      </div>

      <div className="form">
        {canUseDataProducts(datasource, token) ? (
          <div className="toggle-with-label">
            <label htmlFor="use-dataproduct" className="form__label">
              Use Dataproduct
            </label>
            <Toggle checked={useDataProduct} onChange={handleUseDataProductChange} id="use-dataproduct" />
          </div>
        ) : null}

        {canUseDataProducts(datasource, token) && useDataProduct ? (
          isFetchingDataProducts ? (
            <p className="text u-margin-bottom-small">Loading Data Products...</p>
          ) : (
            <DataProductSelection dataproducts={dataProducts} />
          )
        ) : null}

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

        <div className="toggle-with-label u-margin-top-tiny">
          <label className="form__label" htmlFor="console">
            {toggledConsole ? 'Disable Console' : 'Enable Console'}
          </label>
          <Toggle id="console" onChange={handleToggleConsole} checked={toggledConsole} />
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
