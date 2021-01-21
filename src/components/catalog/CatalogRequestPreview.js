import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'react-redux';
import { generateCatalogCurlCommand } from './requests';
import { parseCatalogBody } from './parse';
import CatalogSendEditedRequest from './CatalogSendEditedRequest';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/addon/edit/matchbrackets.js');

const CatalogRequestPreview = ({ catalogState, geometry, timeRange, token, setResults }) => {
  const [text, setText] = useState(generateCatalogCurlCommand(catalogState, geometry, timeRange, token));
  const [isEdited, setIsEdited] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  const handleParse = () => {
    parseCatalogBody(text);
  };
  const handleTextChange = (editor, data, val) => {
    setText(val);
    setIsEdited(true);
  };

  useEffect(() => {
    setText(generateCatalogCurlCommand(catalogState, geometry, timeRange, token));
    setIsEdited(false);
  }, [catalogState, geometry, token, timeRange]);

  return (
    <>
      <h2 className="heading-secondary">Request Preview</h2>
      <div className="form">
        <CodeMirror
          options={{
            mode: 'powershell',
            theme: 'eclipse',
            matchBrackets: true,
          }}
          className="tpdi-editor"
          value={text}
          onBeforeChange={handleTextChange}
        />

        <div className="buttons-container">
          <button className="secondary-button secondary-button--fit" onClick={handleCopy}>
            Copy
          </button>

          <button className="secondary-button secondary-button--fit" onClick={handleParse}>
            Parse
          </button>

          {isEdited ? <CatalogSendEditedRequest setResults={setResults} text={text} token={token} /> : null}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  geometry: state.request.geometry,
  timeRange: {
    timeTo: state.request.timeTo[0],
    timeFrom: state.request.timeFrom[0],
  },
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogRequestPreview);
