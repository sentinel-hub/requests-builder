import React from 'react';

import store from '../../store';
import tpdiSlice from '../../store/tpdi';

const TpdiNameField = ({ name }) => {
  const handleOrderNameChange = (e) => {
    store.dispatch(tpdiSlice.actions.setName(e.target.value));
  };
  return (
    <>
      <label htmlFor="tpdi-name" className="form__label">
        Name
      </label>
      <input
        id="tpdi-name"
        placeholder="e.g: My planet"
        type="text"
        value={name}
        className="form__input mb-2"
        onChange={handleOrderNameChange}
        autoComplete="off"
      />
    </>
  );
};

export default TpdiNameField;
