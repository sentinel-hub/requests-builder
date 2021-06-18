import React from 'react';
import store from '../../../store';
import mapSlice from '../../../store/map';
import { groupBy } from '../../../utils/commonUtils';
import { CRS } from '../../../utils/const/constMap';

// Generate CRS JSX Options, skip those which have internal:true.
const optionsForGroup = (entries) => {
  return entries
    .filter((_, val) => !val.internal)
    .map((epsg, val) => <option key={epsg[0]}>{epsg[0]}</option>);
};

const crsAggregator = (key) => {
  if (/326../gm.test(key[0])) {
    return 'UTM Northern';
  }
  if (/327../gm.test(key[0])) {
    return 'UTM Southern';
  }
  return 'DEFAULT';
};

const generateCRSOptions = (crs) => {
  const entries = Object.entries(crs);
  const grouped = groupBy(entries, crsAggregator);
  return Object.keys(grouped).map((group) => {
    if (group === 'DEFAULT') {
      return optionsForGroup(grouped[group]);
    }
    return (
      <optgroup label={group} key={group}>
        {optionsForGroup(grouped[group])}
      </optgroup>
    );
  });
};

const CRSSelection = ({ selectedCrs }) => {
  const handleCRSChange = (e) => {
    store.dispatch(mapSlice.actions.setSelectedCrs(e.target.value));
  };

  return (
    <div className="u-flex-aligned">
      <label htmlFor="crs" className="form__label" style={{ marginBottom: '0' }}>
        CRS:{' '}
      </label>
      <select
        id="crs"
        className="form__input"
        style={{ marginLeft: '1rem' }}
        onChange={handleCRSChange}
        value={selectedCrs}
      >
        {generateCRSOptions(CRS)}
      </select>
    </div>
  );
};

export default CRSSelection;
