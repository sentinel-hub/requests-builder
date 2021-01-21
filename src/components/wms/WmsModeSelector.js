import React from 'react';
import { connect } from 'react-redux';
import store, { wmsSlice } from '../../store';

const WmsModeSelector = ({ mode }) => {
  const handleWmsModeChange = (e) => {
    store.dispatch(wmsSlice.actions.setMode(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-small">Service</h2>
      <div className="wms-mode-selector">
        <input
          id="wms-mode"
          onChange={handleWmsModeChange}
          className="form__input"
          type="radio"
          value="WMS"
          checked={mode === 'WMS'}
        />
        <label htmlFor="wms-mode" className="form__label">
          WMS
        </label>
        <input
          id="fis"
          onChange={handleWmsModeChange}
          className="form__input"
          type="radio"
          value="FIS"
          checked={mode === 'FIS'}
        />
        <label htmlFor="fis" className="form__label">
          FIS
        </label>
        <input
          id="wcs"
          onChange={handleWmsModeChange}
          className="form__input"
          type="radio"
          value="WCS"
          checked={mode === 'WCS'}
        />
        <label htmlFor="wcs" className="form__label">
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
