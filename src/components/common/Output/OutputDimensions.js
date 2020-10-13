import React, { useEffect, useState } from 'react';
import store, { requestSlice } from '../../../store';
import { calculateDimensionsLowResPreview, calculateAutoDimensions } from '../Map/utils/bboxRatio';
import Toggle from '../Toggle';

import { connect } from 'react-redux';

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

const OutputDimensions = ({ geometry, heightOrRes, height, width }) => {
  const [isAuto, setIsAuto] = useState(true);

  const handleSetAutoRatio = () => {
    setIsAuto(!isAuto);
  };

  const dispatchNewDimensions = (newDimensions) => {
    if (newDimensions) {
      const newWidth = newDimensions[0];
      const newHeight = newDimensions[1];
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: newWidth, y: newHeight }));
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

  const handleRadioChange = (e) => {
    store.dispatch(requestSlice.actions.setHeightOrRes(e.target.value));
    if (e.target.value === 'RES') {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: 100, y: 100 }));
    }
  };

  useEffect(() => {
    if (isAuto && geometry && heightOrRes === 'HEIGHT') {
      const newDimensions = calculateDimensionsLowResPreview(geometry);
      dispatchNewDimensions(newDimensions);
    }
  }, [geometry, isAuto, heightOrRes]);

  return (
    <>
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

      <label htmlFor="width-input" className="form__label">
        {heightOrRes === 'HEIGHT' ? 'Width' : 'Res X (in CRS units)'}
      </label>
      <input
        id="width-input"
        required
        className="form__input"
        type="text"
        name="x"
        value={width}
        onChange={handleTextChange}
        placeholder={generatePlaceholder(heightOrRes, 'x')}
      />
      <label htmlFor="height-input" className="form__label">
        {heightOrRes === 'HEIGHT' ? 'Height' : 'Res Y (in CRS units)'}
      </label>
      <input
        id="height-input"
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
          <Toggle id="auto" checked={isAuto} onChange={handleSetAutoRatio} />
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  heightOrRes: state.request.heightOrRes,
  height: state.request.height,
  width: state.request.width,
  geometry: state.request.geometry,
});

export default connect(mapStateToProps)(OutputDimensions);
