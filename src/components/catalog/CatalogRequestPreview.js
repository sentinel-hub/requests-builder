import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { connect } from 'react-redux';
import { generateCatalogCurlCommand } from './requests';
import { parseCatalogBody } from './parse';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/addon/edit/matchbrackets.js');

const CatalogRequestPreview = ({ catalogState, geometry, token }) => {
  const [text, setText] = useState(generateCatalogCurlCommand(catalogState, geometry, token));

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  const handleParse = () => {
    parseCatalogBody(text);
  };
  const handleChange = (val) => {
    setText(val);
  };

  useEffect(() => {
    setText(generateCatalogCurlCommand(catalogState, geometry, token));
  }, [catalogState, geometry, token]);

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
          onBeforeChange={(editor, data, value) => {
            handleChange(value);
          }}
        />

        <div className="buttons-container">
          <button className="secondary-button secondary-button--fit" onClick={handleCopy}>
            Copy
          </button>

          <button className="secondary-button secondary-button--fit" onClick={handleParse}>
            Parse
          </button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  geometry: state.request.geometry,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogRequestPreview);
