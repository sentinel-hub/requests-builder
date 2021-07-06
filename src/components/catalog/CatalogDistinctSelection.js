import React from 'react';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import { S1GRD_CATALOG_ID, S2L1C_CATALOG_ID, S2L2A_CATALOG_ID } from './const';
import { hasProperties } from './CatalogQueryOptions';
import Select from '../common/Select';

const baseDistinctOptions = [
  {
    name: 'Date',
    value: 'date',
  },
];

const s1DistinctOptions = [
  ...baseDistinctOptions,
  {
    name: 'Instrument Mode',
    value: 'sar:instrument_mode',
  },
  {
    name: 'Orbit State',
    value: 'sat:orbit_state',
  },
  {
    name: 'Polarization',
    value: 'polarization',
  },
];

const generateDistinctOptions = (collectionId) => {
  switch (collectionId) {
    case S2L2A_CATALOG_ID:
    case S2L1C_CATALOG_ID:
      return baseDistinctOptions;
    case S1GRD_CATALOG_ID:
      return s1DistinctOptions;
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
          <h2 className="heading-secondary mt-2">Distinct</h2>
          <div className="form">
            <Select
              selected={distinct}
              onChange={handleDistinctChange}
              options={generateDistinctOptions(selectedCollection)}
            />
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
