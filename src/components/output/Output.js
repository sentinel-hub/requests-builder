import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store, { requestSlice } from '../../store';
import { OUTPUT_FORMATS } from '../../utils/const';
import { calculateDimensionsLowResPreview, calculateAutoDimensions } from '../../utils/bboxRatio';
import Toggle from '../Toggle';

const generatePlaceholder = (heightOrRes, input) => {
  if (heightOrRes === 'HEIGHT') {
    if (input === 'x') {
      return 'width in px';
    }
    if (input === 'y') {
      return 'height in px';
    }
  } else if (heightOrRes === 'RES') {
    if (input === 'x') {
      return 'x resolution in meters';
    }
    if (input === 'y') {
      return 'y resolution in meters';
    }
  }
};

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
      <label className="form__label">Image Format</label>
      <select onChange={handleImageFormatChange} value={resp.format} name={resp.idx} className="form__input">
        {OUTPUT_FORMATS.map((format) => (
          <option key={format.name} value={format.value}>
            {format.name}
          </option>
        ))}
      </select>

      <label className="form__label">Identifier</label>
      <input
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

const Output = ({ heightOrRes, height, width, geometry, mode, responses }) => {
  const [isAuto, setIsAuto] = useState(true);

  const handleRadioChange = (e) => {
    store.dispatch(requestSlice.actions.setHeightOrRes(e.target.value));
    if (e.target.value === 'RES') {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: 100, y: 100 }));
    }
  };

  const handleTextChange = (e) => {
    if (isAuto && e.target.value !== '') {
      if (e.target.name === 'x') {
        const newDimensions = calculateAutoDimensions(geometry, parseInt(e.target.value), undefined);
        dispatchNewDimensions(newDimensions);
      } else if (e.target.name === 'y') {
        const newDimensions = calculateAutoDimensions(geometry, undefined, parseInt(e.target.value));
        dispatchNewDimensions(newDimensions);
      }
    } else {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [e.target.name]: e.target.value }));
    }
  };

  const dispatchNewDimensions = (newDimensions) => {
    if (newDimensions) {
      const newWidth = newDimensions[0];
      const newHeight = newDimensions[1];
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: newWidth, y: newHeight }));
    }
  };

  const handleAddResponse = () => {
    store.dispatch(requestSlice.actions.addResponse());
  };

  // Update output width/height when geometry is updated. Keeps bbox ratio (only when selecting height or res)
  useEffect(() => {
    if (isAuto && geometry && heightOrRes === 'HEIGHT') {
      const newDimensions = calculateDimensionsLowResPreview(geometry);
      dispatchNewDimensions(newDimensions);
    }
  }, [geometry, isAuto, heightOrRes]);

  return (
    <>
      <h2 className="heading-secondary">{mode === 'PROCESS' ? 'Output' : 'Output - Low res preview'}</h2>
      <div className="form">
        <div className="width-or-res">
          <input
            className="form__input u-margin-right-tiny"
            onChange={handleRadioChange}
            checked={heightOrRes === 'HEIGHT'}
            type="radio"
            id="height"
            value="HEIGHT"
            name="format"
            style={{ cursor: 'pointer' }}
          />
          <label style={{ cursor: 'pointer' }} className="form__label u-margin-right-small" htmlFor="height">
            Height and width
          </label>
          <input
            className="form__input u-margin-right-tiny"
            onChange={handleRadioChange}
            checked={heightOrRes === 'RES'}
            type="radio"
            id="res"
            value="RES"
            name="format"
            style={{ cursor: 'pointer' }}
          />
          <label style={{ cursor: 'pointer' }} className="form__label" htmlFor="res">
            Resolution
          </label>
        </div>

        <label className="form__label">{heightOrRes === 'HEIGHT' ? 'Width' : 'Res X (in CRS units)'}</label>
        <input
          required
          className="form__input"
          type="text"
          name="x"
          value={width}
          onChange={handleTextChange}
          placeholder={generatePlaceholder(heightOrRes, 'x')}
        />
        <label className="form__label">{heightOrRes === 'HEIGHT' ? 'Height' : 'Res Y (in CRS units)'}</label>
        <input
          required
          className="form__input"
          type="text"
          name="y"
          value={height}
          onChange={handleTextChange}
          placeholder={generatePlaceholder(heightOrRes, 'y')}
        />

        {heightOrRes === 'HEIGHT' ? (
          <div className="toggle-with-label">
            <label htmlFor="auto" className="form__label">
              Keep ratio automatically
            </label>
            <Toggle id="auto" checked={isAuto} onChange={() => setIsAuto(!isAuto)} />
          </div>
        ) : null}

        {generateResponses(responses, mode)}

        {mode !== 'WMS' ? (
          <button className="secondary-button" onClick={handleAddResponse}>
            Add Response
          </button>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  heightOrRes: store.request.heightOrRes,
  responses: store.request.responses,
  height: store.request.height,
  width: store.request.width,
  geometry: store.request.geometry,
  mode: store.request.mode,
});

export default connect(mapStateToProps, null)(Output);
