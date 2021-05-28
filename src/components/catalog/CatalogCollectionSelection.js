import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import Axios from 'axios';
import { addWarningAlert } from '../../store/alert';
import CatalogResource from '../../api/catalog/CatalogResource';
import { CATALOG_OPTIONS } from './const';

const generateCollectionsOptions = (collections) =>
  collections.map((collection) => (
    <option key={collection.id} value={collection.id}>
      {collection.title}
    </option>
  ));

const CatalogCollectionSelection = ({ token, selectedCollection, deploymentUrl }) => {
  const [collections, setCollections] = useState([]);
  const [isFetchingCollections, setIsFetchingCollections] = useState(false);

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const fetchCollections = async () => {
      setIsFetchingCollections(true);
      try {
        const resp = await CatalogResource.getCollections(deploymentUrl)(null, {
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
        } else {
          addWarningAlert('Something went wrong');
        }
        setIsFetchingCollections(false);
      }
    };

    if (token && deploymentUrl) {
      fetchCollections();
    }

    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [token, deploymentUrl]);

  const handleSelectedCollectionChange = (e) => {
    store.dispatch(catalogSlice.actions.setSelectedCollection(e.target.value));
  };

  const handleDeploymentChange = (e) => {
    store.dispatch(catalogSlice.actions.setDeploymentUrl(e.target.value));
  };

  if (!token) {
    return (
      <>
        <h2 className="heading-secondary">Collections</h2>
        <div className="form">
          <p className="text">Log in to use this!</p>;
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="heading-secondary">Collections</h2>
      <div className="form">
        <label className="form__label">Deployment</label>
        <select className="form__input" value={deploymentUrl} onChange={handleDeploymentChange}>
          <option value="">Select a deployment</option>
          {CATALOG_OPTIONS.map((opt) => (
            <option value={opt.url} key={opt.url}>
              {opt.name}
            </option>
          ))}
        </select>

        <label className="form__label">Collection</label>
        {deploymentUrl !== '' ? (
          isFetchingCollections ? (
            <p className="text">Fetching collections...</p>
          ) : (
            <select
              id="catalog-collection"
              value={selectedCollection}
              onChange={handleSelectedCollectionChange}
              className="form__input"
            >
              <option value="">Select a Collection</option>
              {generateCollectionsOptions(collections)}
            </select>
          )
        ) : (
          <p className="text">Select a deployment to see the collections</p>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  selectedCollection: state.catalog.selectedCollection,
  deploymentUrl: state.catalog.deploymentUrl,
});

export default connect(mapStateToProps)(CatalogCollectionSelection);
