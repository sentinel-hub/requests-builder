import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { CUSTOM, datasourceToCustomRepoLink, getDefaultEvalscript } from '../../../utils/const/const';
import { fetchDataProducts } from './utils';
import { JSHINT } from 'jshint';
import Toggle from '../Toggle';
import DataProductSelection from './DataProductSelection';
import Axios from 'axios';
import Tooltip from '../Tooltip/Tooltip';

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

const canUseDataProducts = (datasource, token) => token && datasource !== CUSTOM;

const EvalscriptEditor = ({ dataCollection, mode, evalscript, token, consoleValue, className }) => {
  const [toggledConsole, setToggledConsole] = useState(false);
  const [useDataProduct, setUseDataProduct] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [isFetchingDataProducts, setIsFetchingDataProducts] = useState(false);

  const fetchAndSetDataProducts = useCallback(async (dataCollection, token, reqConfig) => {
    try {
      setIsFetchingDataProducts(true);
      const dataproducts = await fetchDataProducts(dataCollection, token, reqConfig);
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
    if (useDataProduct && dataProducts.length === 0 && canUseDataProducts(dataCollection, token)) {
      fetchAndSetDataProducts(dataCollection, token, { cancelToken: source.token });
    }
    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [dataCollection, useDataProduct, token, dataProducts.length, fetchAndSetDataProducts]);

  // Reset Data Products when datasource changes.
  useEffect(() => {
    setDataProducts([]);
  }, [dataCollection]);

  const handleTextChange = (editor, data, code) => {
    store.dispatch(requestSlice.actions.setEvalscript(code));
  };

  const handleSetDefaultEvalscript = () => {
    const defaultEvalscript = getDefaultEvalscript(mode, dataCollection);
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
        {canUseDataProducts(dataCollection, token) ? (
          <div className="flex items-center mb-2">
            <label htmlFor="use-dataproduct" className="form__label">
              Use Dataproduct
            </label>
            <Toggle checked={useDataProduct} onChange={handleUseDataProductChange} id="use-dataproduct" />
          </div>
        ) : null}

        {canUseDataProducts(dataCollection, token) && useDataProduct ? (
          isFetchingDataProducts ? (
            <p className="text mb-2">Loading Data Products...</p>
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
});

export default connect(mapStateToProps, null)(EvalscriptEditor);
