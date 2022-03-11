import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';
import RadioSelector from '../common/RadioSelector';

const WMS_MODE_OPTIONS = [
  { name: 'WMS', value: 'WMS' },
  { name: 'WCS', value: 'WCS' },
  { name: 'WFS', value: 'WFS' },
  { name: 'WMTS', value: 'WMTS' },
];

const WmsModeSelector = ({ mode }) => {
  const handleWmsModeChange = (e) => {
    store.dispatch(wmsSlice.actions.setMode(e.target.value));
  };

  return (
    <div className="mb-4">
      <h2 className="heading-secondary">Service</h2>
      <RadioSelector options={WMS_MODE_OPTIONS} onChange={handleWmsModeChange} value={mode} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  mode: state.wms.mode,
});

export default connect(mapStateToProps)(WmsModeSelector);
