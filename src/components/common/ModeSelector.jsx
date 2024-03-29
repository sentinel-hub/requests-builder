import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import requestSlice from '../../store/request';
import RadioSelector from './RadioSelector';

const modeOptions = [
  {
    name: 'Process',
    value: 'PROCESS',
  },
  {
    name: 'Batch',
    value: 'BATCH',
  },
  {
    name: '3rd Party Data Import',
    value: 'TPDI',
  },
  {
    name: 'Catalog',
    value: 'CATALOG',
  },
  {
    name: 'Statistical',
    value: 'STATISTICAL',
  },
  {
    name: 'OGC Services',
    value: 'WMS',
  },
];
const ModeSelector = ({ appMode }) => {
  const handleModeChange = (e) => {
    store.dispatch(requestSlice.actions.setMode(e.target.value));
  };
  return (
    <div className="flex flex-col mb-4">
      <h2 className="heading-secondary mb-1">Select API</h2>
      <RadioSelector onChange={handleModeChange} value={appMode} options={modeOptions} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(ModeSelector);
