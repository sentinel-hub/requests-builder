import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import requestSlice from '../../store/request';

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

const RadioModeSelector = ({ options, appMode }) => {
  const handleModeChange = (e) => {
    store.dispatch(requestSlice.actions.setMode(e.target.value));
  };
  return (
    <div className="flex-col flex items-start md:items-center md:flex-row">
      {options.map((opt) => (
        <div key={`mode-${opt.value}`} className="mb-2 md:mb-0">
          <input
            type="radio"
            className="hidden"
            key={opt.value}
            id={`mode-${opt.value}`}
            value={opt.value}
            onClick={handleModeChange}
          />
          <label
            className={`mr-2 py-1 px-2 rounded-md cursor-pointer hover:bg-primary ${
              opt.value === appMode ? 'bg-primary-dark' : 'bg-primary-light'
            }`}
            htmlFor={`mode-${opt.value}`}
          >
            {opt.name}
          </label>
        </div>
      ))}
    </div>
  );
};

const ModeSelector = ({ appMode }) => {
  return (
    <div className="flex flex-col mb-4">
      <h2 className="heading-secondary mb-1">Select API</h2>
      <RadioModeSelector appMode={appMode} options={modeOptions} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(ModeSelector);
