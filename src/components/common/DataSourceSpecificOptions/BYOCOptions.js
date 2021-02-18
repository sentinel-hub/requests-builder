import React, { useEffect, useState } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import { getCustomCollections } from '../../process/requests';

const generateCollectionOptions = (collections) => {
  return collections.map((collection) => (
    <option key={collection.id} value={collection.id}>
      {collection.name} - {collection.id}
    </option>
  ));
};

const BYOCOptions = ({ token, byocLocation, byocCollectionType, byocCollectionId }) => {
  const [collections, setCollections] = useState([]);

  const handleCollectionIdChange = (e) => {
    store.dispatch(requestSlice.actions.setByocCollectionId(e.target.value));
  };

  useEffect(() => {
    const loadCustomCollections = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await getCustomCollections(token);
        if (res.data) {
          setCollections(
            res.data.data.map((d) => ({ name: d.name, id: d.id, type: d.type, location: d.location })),
          );
        }
      } catch (err) {
        console.error('Unable to load custom collections', err);
      }
    };

    loadCustomCollections();
  }, [token]);

  const handleByocLocationChange = (e) => {
    store.dispatch(requestSlice.actions.setByocLocation(e.target.value));
  };

  const handleByocCollectionTypeChange = (e) => {
    store.dispatch(requestSlice.actions.setByocCollectionType(e.target.value));
  };

  const handleDropdownIdChange = (e) => {
    const selectedCollection = collections.find((col) => col.id === e.target.value);
    if (selectedCollection !== undefined) {
      let { type, location } = selectedCollection;
      location = location ?? '';
      type = type ?? '';
      store.dispatch(requestSlice.actions.setByocLocation(location));
      store.dispatch(requestSlice.actions.setByocCollectionType(type));
    }
    store.dispatch(requestSlice.actions.setByocCollectionId(e.target.value));
  };

  return (
    <div className="form byoc-options">
      {collections.length > 0 ? (
        <>
          <label htmlFor="personal-collections" className="form__label">
            Personal collections
          </label>
          <select id="personal-collections" onChange={handleDropdownIdChange} className="form__input">
            <option value="">Select a custom collection</option>
            {generateCollectionOptions(collections)}
          </select>
        </>
      ) : null}
      <label htmlFor="collection-id" className="form__label">
        Collection Id
      </label>
      <input
        id="collection-id"
        required
        value={byocCollectionId}
        onChange={handleCollectionIdChange}
        type="text"
        className="form__input"
      />

      <label htmlFor="byoc-location" className="form__label">
        Location
      </label>
      <select
        required
        id="byoc-location"
        value={byocLocation}
        onChange={handleByocLocationChange}
        className="form__input"
      >
        <option value="">Select a location</option>
        <option value="aws-eu-central-1">AWS eu-central-1</option>
        <option value="aws-us-west-2">AWS us-west-2</option>
      </select>

      <label htmlFor="byoc-collection-type" className="form__label">
        Collection Type
      </label>
      <select
        required
        id="byoc-location"
        value={byocCollectionType}
        onChange={handleByocCollectionTypeChange}
        className="form__input"
      >
        <option value="">Select a Type</option>
        <option value="BYOC">BYOC</option>
        <option value="BATCH">BATCH</option>
      </select>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  byocLocation: state.request.byocLocation,
  byocCollectionType: state.request.byocCollectionType,
  byocCollectionId: state.request.byocCollectionId,
});

export default connect(mapStateToProps)(BYOCOptions);
