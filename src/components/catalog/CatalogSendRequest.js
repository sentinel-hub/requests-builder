import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import Toggle from '../common/Toggle';
import CatalogSendRequestButton from './CatalogSendRequestButton';
import CatalogSendRequestNextButton from './CatalogSendRequestNextButton';

const NormalCatalogSearch = ({ limit, next, setResults, setCatalogSearchResponse, setUsedCollection }) => {
  const handleLimitChange = (e) => {
    store.dispatch(catalogSlice.actions.setLimit(e.target.value));
  };
  return (
    <>
      <label htmlFor="catalog-limit" className="form__label">
        Limit
      </label>
      <input
        id="catalog-limit"
        onChange={handleLimitChange}
        value={limit}
        className="form__input mb-3"
        type="number"
      />

      <label htmlFor="next" className="form__label">
        Next
      </label>
      <input
        id="next"
        value={next}
        className="form__input mb-2"
        type="number"
        readOnly
        placeholder="Next results..."
      />

      <div className="buttons-container">
        <CatalogSendRequestButton
          setResults={setResults}
          setCatalogSearchResponse={setCatalogSearchResponse}
          setUsedCollection={setUsedCollection}
        />
        {next ? (
          <CatalogSendRequestNextButton
            setResults={setResults}
            setCatalogSearchResponse={setCatalogSearchResponse}
          />
        ) : null}
      </div>
    </>
  );
};

const CatalogSearchByIds = ({ setResults, setCatalogSearchResponse, setUsedCollection, ids }) => {
  const handleCatalogIdChange = (idx) => (e) => {
    const newValue = ids.slice(0, idx).concat([e.target.value, ...ids.slice(idx + 1)]);
    store.dispatch(catalogSlice.actions.setIds(newValue));
  };
  const handleDeleteCatalogId = (idx) => () => {
    const newValue = ids.slice(0, idx).concat(ids.slice(idx + 1));
    store.dispatch(catalogSlice.actions.setIds(newValue));
  };

  const handleAddId = () => {
    const newValue = ids.concat('');
    store.dispatch(catalogSlice.actions.setIds(newValue));
  };

  return (
    <>
      <label className="form__label">Product Ids</label>
      {ids.map((id, idx) => (
        <div
          key={`catalog-id-${idx}`}
          style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
        >
          <input
            className="form__input"
            type="text"
            onChange={handleCatalogIdChange(idx)}
            value={id}
            placeholder="Write the product Id"
            style={{ marginBottom: '0.5rem' }}
          />
          <span
            className="text text--bold"
            onClick={handleDeleteCatalogId(idx)}
            style={{ marginRight: '1rem', cursor: 'pointer' }}
          >
            X
          </span>
        </div>
      ))}
      <div className="flex flex-col">
        {ids.length < 5 && (
          <button className="secondary-button w-fit my-2" onClick={handleAddId}>
            Add ID
          </button>
        )}
        {ids.length === 5 && (
          <p className="text text--warning text--bold" style={{ margin: '0.5rem 0' }}>
            Search by Id is limited to 5 products.
          </p>
        )}
        <CatalogSendRequestButton
          setResults={setResults}
          setCatalogSearchResponse={setCatalogSearchResponse}
          setUsedCollection={setUsedCollection}
        />
      </div>
    </>
  );
};

//limit, get next, send
const CatalogSendRequest = ({
  limit,
  next,
  setResults,
  setCatalogSearchResponse,
  setUsedCollection,
  isSearchingByIds,
  ids,
}) => {
  return (
    <>
      <h2 className="heading-secondary mt-2">Request Options</h2>
      <div className="form">
        <div className="flex items-center mb-1">
          <label className="form__label mr-2" htmlFor="search-by-ids" style={{ cursor: 'pointer' }}>
            Search by ids
          </label>
          <Toggle
            checked={isSearchingByIds}
            id="search-by-ids"
            onChange={() => {
              store.dispatch(catalogSlice.actions.setIsSearchingByIds(!isSearchingByIds));
            }}
          />
        </div>
        {isSearchingByIds ? (
          <CatalogSearchByIds
            setCatalogSearchResponse={setCatalogSearchResponse}
            setResults={setResults}
            setUsedCollection={setUsedCollection}
            ids={ids}
          />
        ) : (
          <NormalCatalogSearch
            limit={limit}
            next={next}
            setResults={setResults}
            setCatalogSearchResponse={setCatalogSearchResponse}
            setUsedCollection={setUsedCollection}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  limit: state.catalog.limit,
  next: state.catalog.next,
  isSearchingByIds: state.catalog.isSearchingByIds,
  ids: state.catalog.ids,
});

export default connect(mapStateToProps)(CatalogSendRequest);
