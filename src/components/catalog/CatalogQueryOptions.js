import React from 'react';
import { connect } from 'react-redux';
import CatalogOptions from './CatalogOptions';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import {
  S2L2A_CATALOG_ID,
  S2L1C_CATALOG_ID,
  S1GRD_CATALOG_ID,
  S1OPTIONS,
  LANDSAT_8_CATALOG_ID,
  S5PL2_CATALOG_ID,
  S5Options,
  CatalogCloudOptions,
  collectionToOptions,
  S3SLSTR_CATALOG_ID,
  S3SLSTR_CATALOG_OPTIONS,
} from './const';

const generateOptionsByCollectionId = (collectionId, idx) => {
  switch (collectionId) {
    case S2L2A_CATALOG_ID:
    case S2L1C_CATALOG_ID:
    case LANDSAT_8_CATALOG_ID:
      return <CatalogOptions options={CatalogCloudOptions} idx={idx} />;
    case S1GRD_CATALOG_ID:
      return <CatalogOptions options={S1OPTIONS} idx={idx} />;
    case S5PL2_CATALOG_ID:
      return <CatalogOptions options={S5Options} idx={idx} />;
    case S3SLSTR_CATALOG_ID:
      return <CatalogOptions options={S3SLSTR_CATALOG_OPTIONS} idx={idx} />;
    default:
      return null;
  }
};

const areQueriesLeft = (selectedCollection, selectedQueriesLength) =>
  collectionToOptions[selectedCollection].length > selectedQueriesLength;

export const hasProperties = (collectionId) => collectionToOptions[collectionId]?.length > 0;

const CatalogQueryOptions = ({ selectedCollection, queryProperties }) => {
  const generateQueryOptions = () => {
    return queryProperties.map((property, idx) => (
      <div key={'property' + idx} className="u-margin-bottom-small">
        <label className="form__label">Property {idx + 1}</label>
        {generateOptionsByCollectionId(selectedCollection, idx)}
        <button
          onClick={handleRemoveProperty}
          name={idx}
          className="secondary-button secondary-button--cancel secondary-button--fit"
        >
          Remove Property
        </button>
      </div>
    ));
  };

  const handleAddQueryProperty = () => {
    store.dispatch(catalogSlice.actions.addQueryProperty());
  };

  const handleRemoveProperty = (e) => {
    store.dispatch(catalogSlice.actions.removeQueryProperty(parseInt(e.target.name)));
  };

  return (
    <>
      {hasProperties(selectedCollection) ? (
        <>
          <h2 className="heading-secondary u-margin-top-small">Query Options</h2>
          <div className="form" style={{ maxHeight: '301px', overflowY: 'scroll' }}>
            {generateQueryOptions()}
            {areQueriesLeft(selectedCollection, queryProperties.length) ? (
              <button onClick={handleAddQueryProperty} className="secondary-button secondary-button--fit">
                Add Query
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedCollection: state.catalog.selectedCollection,
  queryProperties: state.catalog.queryProperties,
});

export default connect(mapStateToProps)(CatalogQueryOptions);
