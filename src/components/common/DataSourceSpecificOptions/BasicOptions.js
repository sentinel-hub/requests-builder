import React, { useState, useEffect } from 'react';
import store, { requestSlice } from '../../../store';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import { connect } from 'react-redux';

//Options appliable to all CC Datasources
const BasicOptions = ({ stateMaxCC, idx }) => {
  const [maxCC, setMaxCC] = useState('100');

  const handleCCChange = (e) => {
    setMaxCC(e.target.value);
  };

  useEffect(() => {
    if (maxCC === '100') {
      store.dispatch(requestSlice.actions.setDataFilterOptions({ maxCloudCoverage: 'DEFAULT', idx }));
    } else {
      store.dispatch(requestSlice.actions.setDataFilterOptions({ maxCloudCoverage: maxCC, idx }));
    }
  }, [maxCC, idx]);

  useEffect(() => {
    if (stateMaxCC && stateMaxCC !== 'DEFAULT') {
      setMaxCC(stateMaxCC);
    }
  }, [stateMaxCC]);

  return (
    <div>
      <label htmlFor={`cloud-coverage-${idx}`} className="form__label">
        Cloud Coverage
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          id={`cloud-coverage-${idx}`}
          className="form__input form__input--range"
          type="range"
          min="0"
          max="100"
          value={maxCC}
          onChange={handleCCChange}
          style={{ display: 'inline-block' }}
        />
        <p className="text" style={{ display: 'inline-block', marginLeft: '1.5rem', marginBottom: '0.8rem' }}>
          {maxCC ? maxCC + ' %' : 'Default'}
        </p>
      </div>
      <BaseOptionsNoCC withCC={true} idx={idx} />
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  stateMaxCC: store.request.dataFilterOptions[ownProps.idx].options.maxCloudCoverage,
});

export default connect(mapStateToProps)(BasicOptions);
