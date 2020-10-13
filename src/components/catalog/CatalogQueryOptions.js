import React from 'react';
import { connect } from 'react-redux';
import CatalogSentinel1Options from './CatalogSentinel1Options';
import store, { catalogSlice } from '../../store';
import CatalogSentinel2Options from './CatalogSentinel2Options';
import { S2L2A_CATALOG_ID, S2L1C_CATALOG_ID, S1GRD_CATALOG_ID, S1OPTIONS } from './const';

const generateOptionsByCollectionId = (collectionId, idx) => {
  switch (collectionId) {
    case S2L2A_CATALOG_ID:
    case S2L1C_CATALOG_ID:
      return <CatalogSentinel2Options idx={idx} />;
    case S1GRD_CATALOG_ID:
      return <CatalogSentinel1Options idx={idx} />;
    default:
      return null;
  }
};

const areQueriesLeft = (selectedCollection, selectedQueriesLength) => {
  if (selectedCollection === S1GRD_CATALOG_ID && selectedQueriesLength < S1OPTIONS.length) {
    return true;
  } else if (
    (selectedCollection === S2L1C_CATALOG_ID || selectedCollection === S2L2A_CATALOG_ID) &&
    selectedQueriesLength < 1
  ) {
    return true;
  }
  return false;
};

export const hasProperties = (collectionId) =>
  collectionId === S2L2A_CATALOG_ID || collectionId === S2L1C_CATALOG_ID || collectionId === S1GRD_CATALOG_ID;

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
