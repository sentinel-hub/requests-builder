import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';
import Select from '../common/Select';

const FIS_STYLE_OPTIONS = [
  { name: 'No Style', value: '' },
  { name: 'Index', value: 'INDEX' },
  { name: 'Grayscale', value: 'GRAYSCALE' },
  { name: 'Colormap', value: 'COLORMAP' },
  { name: 'Sensor', value: 'SENSOR' },
  { name: 'Reflectance', value: 'REFLECTANCE' },
];

const FisAdvancedOptions = ({ advancedOptions }) => {
  useEffect(() => {
    return () => {
      store.dispatch(wmsSlice.actions.resetAdvancedOptions());
    };
  }, []);

  const handleBinsChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ BINS: parseInt(e.target.value) }));
  };

  const handleStyleChange = (value) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ STYLE: value }));
  };

  return (
    <>
      <label className="form__label">Bins</label>
      <input
        onChange={handleBinsChange}
        value={advancedOptions.BINS ?? ''}
        className="form__input mb-2"
        type="number"
        placeholder="Number of bins"
      />
      <label className="form__label">Style</label>
      <Select
        options={FIS_STYLE_OPTIONS}
        selected={advancedOptions.STYLE ?? ''}
        onChange={handleStyleChange}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  advancedOptions: state.wms.advancedOptions,
});

export default connect(mapStateToProps)(FisAdvancedOptions);
