import React, { useEffect, useState } from 'react';
import store, { requestSlice } from '../../../store';
import { connect } from 'react-redux';
import { getCustomCollections } from '../../process/requests';

const generateCollectionOptions = (collections) => {
  return collections.map((collection) => (
    <option key={collection.id} value={collection.id}>
      {collection.name} - {collection.id}
    </option>
  ));
};

const BYOCOptions = ({ dataFilterOptions, token, byocLocation }) => {
  const [collections, setCollections] = useState([]);

  const handleCollectionIdChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ collectionId: e.target.value }));
  };

  useEffect(() => {
    const loadCustomCollections = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await getCustomCollections(token, byocLocation);
        if (res.data) {
          setCollections(res.data.data.map((d) => ({ name: d.name, id: d.id })));
        }
      } catch (err) {
        console.error('Unable to load custom collections', err);
      }
    };

    loadCustomCollections();
  }, [token, byocLocation]);

  const handleByocLocationChange = (e) => {
    store.dispatch(requestSlice.actions.setByocLocation(e.target.value));
  };

  return (
    <div className="byoc-options">
      <label htmlFor="byoc-location" className="form__label">
        Location
      </label>
      <select
        id="byoc-location"
        value={byocLocation}
        onChange={handleByocLocationChange}
        className="form__input"
      >
        <option value="EU-CENTRAL-1">AWS eu-central-1</option>
        <option value="US-WEST-2">AWS us-west-2</option>
      </select>

      <label htmlFor="collection-id" className="form__label">
        Collection Id
      </label>
      <input
        id="collection-id"
        required
        value={!dataFilterOptions.collectionId ? '' : dataFilterOptions.collectionId}
        onChange={handleCollectionIdChange}
        type="text"
        className="form__input"
      />

      {collections.length > 0 ? (
        <>
          <label htmlFor="personal-collections" className="form__label">
            Personal collections
          </label>
          <select id="personal-collections" onChange={handleCollectionIdChange} className="form__input">
            <option value="">Select a custom collection</option>
            {generateCollectionOptions(collections)}
          </select>
        </>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  dataFilterOptions: state.request.dataFilterOptions[0].options,
  token: state.auth.user.access_token,
  byocLocation: state.request.byocLocation,
});

export default connect(mapStateToProps)(BYOCOptions);
