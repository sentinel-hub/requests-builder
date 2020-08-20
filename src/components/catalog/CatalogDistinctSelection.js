import React from 'react';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import { S1GRD_CATALOG_ID, S2L1C_CATALOG_ID, S2L2A_CATALOG_ID } from './const';
import { hasProperties } from './CatalogQueryOptions';

const BaseDistinctOptions = () => {
  return <option value="date">Date</option>;
};

const S1DistinctOptions = () => {
  return (
    <>
      <BaseDistinctOptions />
      <option value="sar:instrument_mode">Instrument Mode</option>
      <option value="sat:orbit_state">Orbit State</option>
      <option value="polarization">Polarization</option>
    </>
  );
};

const generateDistinctOptions = (collectionId) => {
  switch (collectionId) {
    case S2L2A_CATALOG_ID:
    case S2L1C_CATALOG_ID:
      return <BaseDistinctOptions />;
    case S1GRD_CATALOG_ID:
      return <S1DistinctOptions />;
    default:
      return null;
  }
};

const CatalogDistinctSelection = ({ distinct, selectedCollection }) => {
  const handleDistinctChange = (e) => {
    store.dispatch(catalogSlice.actions.setDistinct(e.target.value));
  };

  return (
    <>
      {hasProperties(selectedCollection) ? (
        <>
          <h2 className="heading-secondary u-margin-top-small">Distinct</h2>
          <div className="form">
            <select value={distinct} onChange={handleDistinctChange} className="form__input">
              <option value="">Non Distinct</option>
              {generateDistinctOptions(selectedCollection)}
            </select>
          </div>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  distinct: state.catalog.distinct,
  selectedCollection: state.catalog.selectedCollection,
});

export default connect(mapStateToProps)(CatalogDistinctSelection);
