import React, { useCallback, useEffect, useRef, useState } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import ByocResource from '../../../api/byoc/ByocResource';
import { checkValidUuid } from '../../../utils/stringUtils';

const generateCollectionDatalist = (collections) => {
  return (
    <datalist id="collections-list">
      {collections.map((col) => (
        <option value={col.id} label={col.name} key={col.id} />
      ))}
    </datalist>
  );
};

const BYOCOptions = ({ token, byocLocation, byocCollectionType, byocCollectionId }) => {
  const [collections, setCollections] = useState([]);
  const sourceRef = useRef();

  const handleSetTimeRange = useCallback((type) => {
    if (type === 'BATCH') {
      store.dispatch(requestSlice.actions.disableTimerange(true));
    } else {
      store.dispatch(requestSlice.actions.disableTimerange(false));
    }
  }, []);

  const handleCollectionIdChange = (e) => {
    const { value } = e.target;
    if (checkValidUuid(value)) {
      const selected = collections.find((col) => col.id === value);
      if (selected) {
        let { type, location } = selected;
        location = location ?? '';
        type = type ?? '';
        store.dispatch(requestSlice.actions.setByocLocation(location));
        store.dispatch(requestSlice.actions.setByocCollectionType(type));
        handleSetTimeRange(type);
      }
    }
    store.dispatch(requestSlice.actions.setByocCollectionId(value));
  };

  const loadCustomCollections = useCallback(async () => {
    sourceRef.current = Axios.CancelToken.source();
    try {
      const res = await ByocResource.getCollections(null, { cancelToken: sourceRef.current.token });
      if (res.data) {
        setCollections(
          res.data.data.map((d) => ({ name: d.name, id: d.id, type: d.type, location: d.location })),
        );
      }
    } catch (err) {
      console.error('Unable to load custom collections', err);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadCustomCollections();
    }
    return () => {
      if (sourceRef.current) {
        sourceRef.current.cancel();
      }
    };
  }, [token, loadCustomCollections]);

  const handleByocLocationChange = (e) => {
    store.dispatch(requestSlice.actions.setByocLocation(e.target.value));
  };

  const handleByocCollectionTypeChange = (e) => {
    handleSetTimeRange(e.target.value);
    store.dispatch(requestSlice.actions.setByocCollectionType(e.target.value));
  };

  const handleRefreshCollections = () => {
    loadCustomCollections();
    store.dispatch(requestSlice.actions.setByocCollectionId(''));
  };

  return (
    <div className="form byoc-options" style={{ padding: '0 0 0 1rem' }}>
      <label htmlFor="collection-id" className="form__label">
        Collection Id
      </label>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          id="collection-id"
          required
          value={byocCollectionId}
          onChange={handleCollectionIdChange}
          type="text"
          className="form__input"
          placeholder="Write your collection Id"
          list="collections-list"
          style={{ marginBottom: '0' }}
        />
        {token && collections.length > 0 && generateCollectionDatalist(collections)}

        {token && (
          <button
            className="secondary-button"
            onClick={handleRefreshCollections}
            style={{ marginTop: '0', marginLeft: '0.5rem' }}
          >
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>

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
