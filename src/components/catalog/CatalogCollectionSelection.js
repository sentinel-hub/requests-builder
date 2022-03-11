import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import Axios from 'axios';
import { addWarningAlert } from '../../store/alert';
import CatalogResource from '../../api/catalog/CatalogResource';
import { getCatalogOptions } from './const';
import Select from '../common/Select';
import { getMessageFromApiError } from '../../api';

const generateCollectionsOptions = (collections) =>
  collections.map((collection) => ({
    value: collection.id,
    name: collection.title,
  }));

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
        if (Axios.isCancel(err)) {
          console.error(err);
        } else {
          addWarningAlert(getMessageFromApiError(err, 'Something went wrong fetching catalog collections.'));
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

  const handleSelectedCollectionChange = (value) => {
    store.dispatch(catalogSlice.actions.setSelectedCollection(value));
  };

  const handleDeploymentChange = (value) => {
    store.dispatch(catalogSlice.actions.setDeploymentUrl(value));
  };

  if (!token) {
    return (
      <>
        <h2 className="heading-secondary">Collections</h2>
        <div className="form">
          <p className="text">Log in to use this!</p>
        </div>
      </>
    );
  }
  return (
    <>
      <h2 className="heading-secondary">Collections</h2>
      <div className="form">
        <Select
          selected={deploymentUrl}
          buttonClassNames="mb-2"
          label="Deployment"
          options={[
            { name: 'Select a deployment', value: '' },
            ...getCatalogOptions().map((opt) => ({
              value: opt.url,
              name: opt.name,
            })),
          ]}
          onChange={handleDeploymentChange}
        />

        {deploymentUrl !== '' ? (
          isFetchingCollections ? (
            <p className="text">Fetching collections...</p>
          ) : (
            <Select
              label="Data Collection"
              selected={selectedCollection}
              buttonClassNames="mb-2"
              options={[
                { name: 'Select a collection', value: '' },
                ...generateCollectionsOptions(collections),
              ]}
              optionsClassNames="w-fit"
              onChange={handleSelectedCollectionChange}
            />
          )
        ) : null}
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
