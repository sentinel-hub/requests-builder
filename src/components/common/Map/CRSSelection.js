import React from 'react';
import store from '../../../store';
import mapSlice from '../../../store/map';
import { groupBy } from '../../../utils/commonUtils';
import { CRS } from '../../../utils/const/constMap';
import Select from '../Select';

// Generate CRS JSX Options, skip those which have internal:true.
const optionsForGroup = (entries) => {
  return entries.filter((_, val) => !val.internal).map((epsg, val) => ({ value: epsg[0], name: epsg[0] }));
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
    return optionsForGroup(grouped[group]);
  });
};

const CRSSelection = ({ selectedCrs }) => {
  const handleCRSChange = (value) => {
    store.dispatch(mapSlice.actions.setSelectedCrs(value));
  };
  return (
    <div className="flex items-center w-52">
      <Select
        buttonClassNames="mr-2"
        onChange={handleCRSChange}
        selected={selectedCrs}
        options={generateCRSOptions(CRS).flat()}
      />
    </div>
  );
};

export default CRSSelection;
