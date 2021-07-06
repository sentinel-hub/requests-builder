import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import OverlayButton from '../common/OverlayButton';
import CatalogResultEntry from './CatalogResultEntry';

const filterResults = (features, filterText) => {
  if (filterText === '') {
    return features;
  }
  return features.filter((feature) => feature.id.toLowerCase().includes(filterText.toLowerCase()));
};

const CatalogResults = ({ results, fieldsLength, usedCollection, idsLength }) => {
  const [filterText, setFilterText] = useState('');
  const [filteredResults, setFilteredResults] = useState(results.results);
  const resultsRef = useRef();
  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    setFilteredResults(filterResults(results.results, filterText));
  }, [results, filterText]);

  const maxHeight = 520 + fieldsLength * 20 + idsLength * 20;
  return (
    <>
      <h2 className="heading-secondary">
        <div className="flex justify-between items-center w-11/12">
          Catalog Results
          <OverlayButton elementRef={resultsRef} />
        </div>
      </h2>
      <div className="form" style={{ maxHeight: `${maxHeight}px` }} ref={resultsRef}>
        <label htmlFor="catalog-search" className="form__label">
          Search Features
        </label>
        <input
          id="catalog-search"
          placeholder="Search features by id"
          onChange={handleFilterTextChange}
          type="text"
          className="form__input my-2"
        />
        {filteredResults.length > 0 ? (
          filteredResults.map((res) => (
            <CatalogResultEntry feature={res} key={res.id} usedCollection={usedCollection} />
          ))
        ) : (
          <p className="text my-2">No results</p>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  fieldsLength: state.catalog.includeFields.length + state.catalog.excludeFields.length,
  idsLength: state.catalog.ids.length,
});

export default connect(mapStateToProps)(CatalogResults);
