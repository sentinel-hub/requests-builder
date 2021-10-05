import React, { useEffect, useState } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { calculateAutoDimensions, calculatePixelSize } from '../Map/utils/bboxRatio';
import Toggle from '../Toggle';

import { connect } from 'react-redux';
import { isWritingDecimal, validFloatInput } from '../../../utils/stringUtils';
import RadioSelector from '../RadioSelector';

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

const dispatchNewDimensions = (newDimensions) => {
  if (newDimensions) {
    const newWidth = newDimensions[0];
    const newHeight = newDimensions[1];
    store.dispatch(requestSlice.actions.setWidthOrHeight({ x: newWidth, y: newHeight }));
  }
};

const DIMENSIONS_OPTIONS = [
  { name: 'Height / Width', value: 'HEIGHT' },
  { name: 'Resolution', value: 'RES' },
];
const OutputDimensions = ({
  geometry,
  heightOrRes,
  height,
  width,
  isAutoRatio,
  isOnAutoRes,
  appMode,
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
    const { value, name } = e.target;
    if (isWritingDecimal(value)) {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [name]: value }));
      return;
    }
    if (value === '') {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [name]: '' }));
      return;
    }
    if (!validFloatInput(value)) {
      return;
    }
    if (isAutoRatio && value !== '') {
      if (name === 'x') {
        const newDimensions = calculateAutoDimensions(geometry, Number(value), undefined);
        dispatchNewDimensions(newDimensions);
      } else if (name === 'y') {
        const newDimensions = calculateAutoDimensions(geometry, undefined, Number(value));
        dispatchNewDimensions(newDimensions);
      }
    } else {
      store.dispatch(requestSlice.actions.setWidthOrHeight({ [name]: value }));
    }
  };

  const handleRadioChange = (e) => {
    store.dispatch(requestSlice.actions.setHeightOrRes(e.target.value));
    if (e.target.value === 'RES') {
      store.dispatch(requestSlice.actions.setIsAutoRatio(false));
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
      <RadioSelector options={DIMENSIONS_OPTIONS} onChange={handleRadioChange} value={heightOrRes} />

      {heightOrRes === 'RES' && useAutoResMode && (
        <div className="flex items-center my-2">
          <label htmlFor="res-in-meters" className="form__label cursor-pointer mr-2">
            Resolution in meters
          </label>
          <Toggle checked={shouldDisplayAutoRes} id="res-in-meters" onChange={handleSetResInCrs} />
        </div>
      )}

      {shouldDisplayAutoRes ? (
        <AutoResFields geometry={geometry} appMode={appMode} height={height} width={width} />
      ) : (
        <>
          <label htmlFor="width-input" className="form__label mt-2">
            {heightOrRes === 'HEIGHT' ? 'Width' : 'Res X (in CRS units)'}
          </label>
          <input
            id="width-input"
            required
            className="form__input mb-2"
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
            className="form__input mb-2"
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
        <div className="flex items-center mb-2">
          <label htmlFor="auto" className="form__label cursor-pointer mr-2">
            Keep ratio automatically
          </label>
          <Toggle id="auto" checked={isAutoRatio} onChange={handleSetAutoRatio} />
        </div>
      ) : null}
    </>
  );
};

const AutoResFields = ({ geometry, width, height, appMode }) => {
  const [resX, setResX] = useState(() => {
    const [x] = calculatePixelSize(geometry, [width, height]);
    return x;
  });
  const [resY, setResY] = useState(() => {
    const [, y] = calculatePixelSize(geometry, [width, height]);
    return y;
  });

  useEffect(() => {
    if (appMode === 'WMS') {
      dispatchNewDimensions([resX, resY]);
    } else {
      const newDimensions = calculatePixelSize(geometry, [resX, resY]);
      dispatchNewDimensions(newDimensions);
    }
  }, [resX, resY, geometry, appMode]);

  return (
    <>
      <label htmlFor="res-x-meters" className="form__label">
        Res X in meters
      </label>
      <input
        id="res-x-meters"
        className="form__input mb-2"
        value={resX}
        onChange={(e) => setResX(Number(e.target.value))}
        type="number"
      />
      <label htmlFor="res-y-meters" className="form__label">
        Res Y in meters
      </label>
      <input
        id="res-y-meters"
        className="form__input mb-2"
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
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(OutputDimensions);
