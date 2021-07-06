import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';

const WmsModeSelector = ({ mode }) => {
  const handleWmsModeChange = (e) => {
    store.dispatch(wmsSlice.actions.setMode(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary">Service</h2>
      <div className="flex items-center mb-2">
        <input
          id="wms-mode"
          onChange={handleWmsModeChange}
          className="form__input w-fit"
          type="radio"
          value="WMS"
          checked={mode === 'WMS'}
        />
        <label htmlFor="wms-mode" className="form__label mr-2">
          WMS
        </label>
        <input
          id="fis"
          onChange={handleWmsModeChange}
          className="form__input w-fit"
          type="radio"
          value="FIS"
          checked={mode === 'FIS'}
        />
        <label htmlFor="fis" className="form__label mr-2">
          FIS
        </label>
        <input
          id="wcs"
          onChange={handleWmsModeChange}
          className="form__input w-fit"
          type="radio"
          value="WCS"
          checked={mode === 'WCS'}
        />
        <label htmlFor="wcs" className="form__label mr-2">
          WCS
        </label>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  mode: state.wms.mode,
});

export default connect(mapStateToProps)(WmsModeSelector);
