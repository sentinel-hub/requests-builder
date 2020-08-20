import React from 'react';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import CatalogSendRequestButton from './CatalogSendRequestButton';
import CatalogSendRequestNextButton from './CatalogSendRequestNextButton';

//limit, get next, send
const CatalogSendRequest = ({ limit, next, setResults }) => {
  const handleLimitChange = (e) => {
    store.dispatch(catalogSlice.actions.setLimit(parseInt(e.target.value)));
  };
  return (
    <>
      <h2 className="heading-secondary u-margin-top-small">Request Options</h2>
      <div className="form">
        <label className="form__label">Limit</label>
        <input onChange={handleLimitChange} value={limit} className="form__input" type="number" />

        <label className="form__label">Next</label>
        <input value={next} className="form__input" type="number" readOnly />

        <div className="buttons-container">
          <CatalogSendRequestButton setResults={setResults} />
          {next ? <CatalogSendRequestNextButton setResults={setResults} /> : null}
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
