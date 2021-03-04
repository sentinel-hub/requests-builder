import React from 'react';
import store from '../../../store';
import mapSlice from '../../../store/map';
import { CRS } from '../../../utils/const';

// Generate CRS JSX Options, skip those which have internal:true.
const generateCRSOptions = (crs) =>
  Object.keys(crs)
    .map((key) =>
      !crs[key].internal ? (
        <option key={key} value={key}>
          {key}
        </option>
      ) : undefined,
    )
    .filter((o) => o);

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
