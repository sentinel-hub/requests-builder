import React from 'react';
import store, { requestSlice } from '../../../store';
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
    store.dispatch(requestSlice.actions.setCRS(e.target.value));
  };

  return (
    <div className="input-with-item">
      <label htmlFor="crs" className="form__label">
        CRS:{' '}
      </label>
      <select
        id="crs"
        className="form__input"
        style={{ transform: 'translateY(-5px)', marginLeft: '1rem' }}
        onChange={handleCRSChange}
        value={selectedCrs}
      >
        {generateCRSOptions(CRS)}
      </select>
    </div>
  );
};

export default CRSSelection;
