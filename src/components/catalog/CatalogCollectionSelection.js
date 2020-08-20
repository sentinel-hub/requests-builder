import React, { useState, useEffect } from 'react';
import { getCatalogCollections } from './requests';

import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import Axios from 'axios';

const generateCollectionsOptions = (collections) =>
  collections.map((collection) => (
    <option key={collection.id} value={collection.id}>
      {collection.title}
    </option>
  ));

const CatalogCollectionSelection = ({ token, selectedCollection }) => {
  const [collections, setCollections] = useState([]);
  const [isFetchingCollections, setIsFetchingCollections] = useState(false);

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const fetchCollections = async () => {
      setIsFetchingCollections(true);
      try {
        const resp = await getCatalogCollections(token, {
          cancelToken: source.token,
        });
        if (resp.data.collections) {
          setCollections(
            resp.data.collections.map((collection) => ({
              id: collection.id,
              title: collection.title,
            })),
          );
          setIsFetchingCollections(false);
        }
      } catch (err) {
        if (!Axios.isCancel(err)) {
          console.error(err);
        }
      }
    };

    if (token) {
      fetchCollections();
    }

    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [token]);

  const handleSelectedCollectionChange = (e) => {
    store.dispatch(catalogSlice.actions.setSelectedCollection(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary">Collection</h2>
      <div className="form">
        {!token ? (
          <p className="text">Log in to use this</p>
        ) : isFetchingCollections ? (
          <p className="text">Loading...</p>
        ) : (
          <>
            <label className="form__label">Selected Collection</label>
            <select
              value={selectedCollection}
              onChange={handleSelectedCollectionChange}
              className="form__input"
            >
              <option value="">Select a Collection</option>
              {generateCollectionsOptions(collections)}
            </select>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  selectedCollection: state.catalog.selectedCollection,
});
export default connect(mapStateToProps)(CatalogCollectionSelection);
