import React, { useEffect, useState } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { calculateAutoDimensions, calculatePixelSize } from '../Map/utils/bboxRatio';
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

const isWritingDecimal = (input) => /^\d*(\.|,)0*$/.test(input);

const dispatchNewDimensions = (newDimensions) => {
  if (newDimensions) {
    const newWidth = newDimensions[0];
    const newHeight = newDimensions[1];
    store.dispatch(requestSlice.actions.setWidthOrHeight({ x: newWidth, y: newHeight }));
  }
};

const OutputDimensions = ({
  geometry,
  heightOrRes,
  height,
  width,
  isAutoRatio,
  isOnAutoRes,
  useAutoResMode = true,
}) => {
  const handleSetAutoRatio = () => {
    store.dispatch(requestSlice.actions.setIsAutoRatio(!isAutoRatio));
  };

  const handleSetResInCrs = () => {
    if (isOnAutoRes) {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: 100, y: 100 }));
    }
    store.dispatch(requestSlice.actions.setIsOnAutoRes(!isOnAutoRes));
  };

  const shouldDisplayAutoRes = heightOrRes === 'RES' && isOnAutoRes && useAutoResMode;

  const handleTextChange = (e) => {
    if (isWritingDecimal(e.target.value)) {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [e.target.name]: e.target.value }));
      return;
    }
    if (isAutoRatio && e.target.value !== '') {
      if (e.target.name === 'x') {
        const newDimensions = calculateAutoDimensions(geometry, Number(e.target.value), undefined);
        dispatchNewDimensions(newDimensions);
      } else if (e.target.name === 'y') {
        const newDimensions = calculateAutoDimensions(geometry, undefined, Number(e.target.value));
        dispatchNewDimensions(newDimensions);
      }
    } else {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [e.target.name]: e.target.value }));
    }
  };

  const handleRadioChange = (e) => {
    store.dispatch(requestSlice.actions.setHeightOrRes(e.target.value));
    if (e.target.value === 'RES') {
      store.dispatch(requestSlice.actions.setIsAutoRatio(false));
      store.dispatch(requestSlice.actions.setWidthOrHeight({ x: 100, y: 100 }));
    } else {
      store.dispatch(requestSlice.actions.setIsAutoRatio(true));
    }
  };

  // Effect that takes care to update dimensions when geometry and isAutoRatio (toggle) changes.
  useEffect(() => {
    if (isAutoRatio && geometry && heightOrRes === 'HEIGHT') {
      let newDimensions;
      if (width >= height) {
        newDimensions = calculateAutoDimensions(geometry, Number(width), undefined);
      } else {
        newDimensions = calculateAutoDimensions(geometry, undefined, Number(height));
      }
      dispatchNewDimensions(newDimensions);
    }
    // We don't want to re-calculate dimensions when height/width changes. Only when geometry does.
    // eslint-disable-next-line
  }, [geometry, isAutoRatio]);

  // Effect that resets the dimensions to proper ratio (default 512 width) when changin between heigth/res.
  useEffect(() => {
    if (isAutoRatio && geometry && heightOrRes === 'HEIGHT') {
      dispatchNewDimensions(calculateAutoDimensions(geometry, 512, undefined));
    }
    // eslint-disable-next-line
  }, [heightOrRes]);

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
          Height/width
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

      {heightOrRes === 'RES' && useAutoResMode && (
        <div className="toggle-with-label">
          <label htmlFor="res-in-meters" className="form__label">
            Resolution in meters
          </label>
          <Toggle checked={shouldDisplayAutoRes} id="res-in-meters" onChange={handleSetResInCrs} />
        </div>
      )}

      {shouldDisplayAutoRes ? (
        <AutoResFields geometry={geometry} />
      ) : (
        <>
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </>
      )}

      {heightOrRes === 'HEIGHT' ? (
        <div className="toggle-with-label">
          <label htmlFor="auto" className="form__label">
            Keep ratio automatically
          </label>
          <Toggle id="auto" checked={isAutoRatio} onChange={handleSetAutoRatio} />
        </div>
      ) : null}
    </>
  );
};

const AutoResFields = ({ geometry }) => {
  const [resX, setResX] = useState(20);
  const [resY, setResY] = useState(20);

  useEffect(() => {
    const newDimensions = calculatePixelSize(geometry, [resX, resY]);
    dispatchNewDimensions(newDimensions);
  }, [resX, resY, geometry]);

  return (
    <>
      <label htmlFor="res-x-meters" className="form__label">
        Res X in meters
      </label>
      <input
        id="res-x-meters"
        className="form__input"
        value={resX}
        onChange={(e) => setResX(Number(e.target.value))}
        type="number"
      />
      <label htmlFor="res-y-meters" className="form__label">
        Res Y in meters
      </label>
      <input
        id="res-y-meters"
        className="form__input"
        value={resY}
        onChange={(e) => setResY(Number(e.target.value))}
        type="number"
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  heightOrRes: state.request.heightOrRes,
  height: state.request.height,
  width: state.request.width,
  geometry: state.map.wgs84Geometry,
  isAutoRatio: state.request.isAutoRatio,
  isOnAutoRes: state.request.isOnAutoRes,
});

export default connect(mapStateToProps)(OutputDimensions);
