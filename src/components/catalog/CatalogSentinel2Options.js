import React from 'react';
import store, { catalogSlice } from '../../store';
import { connect } from 'react-redux';

const CatalogSentinel2Options = ({ queryProperties, idx }) => {
  const handlePropertyChange = (e) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyName: e.target.value }));
  };

  const handlePropertyValueChange = (e) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyValue: e.target.value }));
  };

  const handleOperatorChange = (e) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, operator: e.target.value }));
  };

  return (
    <>
      <select
        onChange={handlePropertyChange}
        value={queryProperties[idx].propertyName}
        className="form__input"
      >
        <option value="">Select A Property</option>
        <option value="eo:cloud_cover">Cloud Coverage</option>
      </select>
      {queryProperties[idx].propertyName ? (
        <select value={queryProperties[idx].operator} onChange={handleOperatorChange} className="form__input">
          <option value="">Select an operator</option>
          <option value="eq">eq</option>
          <option value="gt">gt</option>
          <option value="lt">lt</option>
          <option value="gte">gte</option>
          <option value="lte">lte</option>
        </select>
      ) : null}

      {queryProperties[idx].propertyName ? (
        <input
          value={queryProperties[idx].propertyValue}
          onChange={handlePropertyValueChange}
          className="form__input"
          type="number"
        />
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  queryProperties: state.catalog.queryProperties,
});

export default connect(mapStateToProps)(CatalogSentinel2Options);
