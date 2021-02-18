import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import CatalogSendRequestButton from './CatalogSendRequestButton';
import CatalogSendRequestNextButton from './CatalogSendRequestNextButton';

//limit, get next, send
const CatalogSendRequest = ({ limit, next, setResults, setCatalogSearchResponse }) => {
  const handleLimitChange = (e) => {
    store.dispatch(catalogSlice.actions.setLimit(e.target.value));
  };
  return (
    <>
      <h2 className="heading-secondary u-margin-top-small">Request Options</h2>
      <div className="form">
        <label htmlFor="catalog-limit" className="form__label">
          Limit
        </label>
        <input
          id="catalog-limit"
          onChange={handleLimitChange}
          value={limit}
          className="form__input"
          type="number"
        />

        <label htmlFor="next" className="form__label">
          Next
        </label>
        <input id="next" value={next} className="form__input" type="number" readOnly />

        <div className="buttons-container">
          <CatalogSendRequestButton
            setResults={setResults}
            setCatalogSearchResponse={setCatalogSearchResponse}
          />
          {next ? (
            <CatalogSendRequestNextButton
              setResults={setResults}
              setCatalogSearchResponse={setCatalogSearchResponse}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  limit: state.catalog.limit,
  next: state.catalog.next,
});

export default connect(mapStateToProps)(CatalogSendRequest);
