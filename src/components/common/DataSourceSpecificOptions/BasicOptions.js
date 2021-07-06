import React, { useState, useEffect } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import { connect } from 'react-redux';

//Options appliable to all CC Datasources
const BasicOptions = ({ stateMaxCC, idx }) => {
  const [maxCC, setMaxCC] = useState('100');

  const handleCCChange = (e) => {
    setMaxCC(Number(e.target.value));
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
    <>
      <label htmlFor={`cloud-coverage-${idx}`} className="form__label">
        Cloud Coverage - {maxCC !== undefined ? maxCC + ' %' : 'Default'}
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          id={`cloud-coverage-${idx}`}
          className="form__input form__input--range mb-1"
          type="range"
          min="0"
          max="100"
          value={maxCC}
          onChange={handleCCChange}
          style={{ display: 'inline-block' }}
        />
      </div>
      <BaseOptionsNoCC withCC={true} idx={idx} />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  stateMaxCC: store.request.dataFilterOptions[ownProps.idx].options.maxCloudCoverage,
});

export default connect(mapStateToProps)(BasicOptions);
