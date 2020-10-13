import React from 'react';
import store, { requestSlice } from '../../../store';
import { OUTPUT_FORMATS } from '../../../utils/const';
import { connect } from 'react-redux';

const generateResponses = (responses, mode) => {
  const handleIdentifierChange = (e) => {
    store.dispatch(
      requestSlice.actions.setResponse({ idx: parseInt(e.target.name), identifier: e.target.value }),
    );
  };

  const handleImageFormatChange = (e) => {
    store.dispatch(
      requestSlice.actions.setResponse({ idx: parseInt(e.target.name), format: e.target.value }),
    );
  };

  const handleDeleteResponse = (e) => {
    store.dispatch(requestSlice.actions.deleteResponse(parseInt(e.target.getAttribute('name'))));
  };

  if (mode === 'WMS') {
    return (
      <div className="response">
        <label className="form__label">Image Format</label>
        <select
          onChange={handleImageFormatChange}
          value={responses[0].format}
          name={responses[0].idx}
          className="form__input"
        >
          {OUTPUT_FORMATS.map((format) => (
            <option key={format.name} value={format.value}>
              {format.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return responses.map((resp, idx) => (
    <div className="response" key={resp.idx}>
      <label htmlFor={`image-format-${idx}`} className="form__label">
        Image Format
      </label>
      <select
        id={`image-format-${idx}`}
        onChange={handleImageFormatChange}
        value={resp.format}
        name={resp.idx}
        className="form__input"
      >
        {OUTPUT_FORMATS.map((format) => (
          <option key={format.name} value={format.value}>
            {format.name}
          </option>
        ))}
      </select>

      <label htmlFor={`identifier-${idx}`} className="form__label">
        Identifier
      </label>
      <input
        id={`identifier-${idx}`}
        value={resp.identifier}
        onChange={handleIdentifierChange}
        name={resp.idx}
        type="text"
        className="form__input"
      />

      {resp.idx !== 0 ? (
        <button
          name={resp.idx}
          className="secondary-button secondary-button--cancel"
          onClick={handleDeleteResponse}
        >
          Remove Response
        </button>
      ) : null}
      {responses.length - 1 !== idx ? <hr className="u-margin-top-tiny"></hr> : null}
    </div>
  ));
};
const OutputResponses = ({ responses, mode }) => {
  const handleAddResponse = () => {
    store.dispatch(requestSlice.actions.addResponse());
  };

  return (
    <>
      {generateResponses(responses, mode)}

      {mode !== 'WMS' ? (
        <button className="secondary-button secondary-button--fit" onClick={handleAddResponse}>
          Add Response
        </button>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  responses: state.request.responses,
  mode: state.request.mode,
});

export default connect(mapStateToProps)(OutputResponses);
