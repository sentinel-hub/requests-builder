import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';

const OGCAdvancedOptions = ({ mode, advancedOptions }) => {
  const BINS = advancedOptions.BINS ? advancedOptions.BINS : '';

  useEffect(() => {
    return () => {
      store.dispatch(wmsSlice.actions.resetAdvancedOptions());
    };
  }, []);

  const handleBinsChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ BINS: parseInt(e.target.value) }));
  };

  const handleStyleChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ STYLE: e.target.value }));
  };

  if (mode !== 'FIS') {
    return null;
  }

  return (
    <>
      <label className="form__label">Bins</label>
      <input
        onChange={handleBinsChange}
        value={BINS}
        className="form__input mb-2"
        type="number"
        placeholder="Number of bins"
      />
      <label className="form__label">Style</label>
      <select className="form__input" onChange={handleStyleChange}>
        <option value="">No style</option>
        <option value="INDEX">Index</option>
        <option value="GRAYSCALE">Grayscale</option>
        <option value="COLORMAP">Colormap</option>
        <option value="SENSOR">Sensor</option>
        <option value="REFLECTANCE">Reflectance</option>
      </select>
    </>
  );
};

const mapStateToProps = (state) => ({
  mode: state.wms.mode,
  advancedOptions: state.wms.advancedOptions,
});

export default connect(mapStateToProps)(OGCAdvancedOptions);
