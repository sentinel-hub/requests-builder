import React, { useCallback, useEffect, useRef, useState } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import ByocResource from '../../../api/byoc/ByocResource';
import { checkValidUuid } from '../../../utils/stringUtils';
import Select from '../Select';
import {
  CODEDE_DEPLOYMENT,
  CREODIAS_DEPLOYMENT,
  EU_CENTRAL_DEPLOYMENT,
  US_WEST_DEPLOYMENT,
} from '../../../utils/const/const';
import { addWarningAlert } from '../../../store/alert';
import { getMessageFromApiError } from '../../../api';

const generateCollectionDatalist = (collections) => {
  return (
    <datalist id="collections-list">
      {collections.map((col) => (
        <option value={col.id} label={col.name} key={col.id} />
      ))}
    </datalist>
  );
};

const byocTypeOptions = [
  { value: '', name: 'Select a type' },
  { value: 'BYOC', name: 'BYOC' },
  { value: 'BATCH', name: 'BATCH' },
  { value: 'ZARR', name: 'ZARR' },
];

const BLANK_LOCATION_OPTION = {
  value: '',
  name: 'Select a deployment',
};

const AWS_LOCATION_OPTION = {
  value: EU_CENTRAL_DEPLOYMENT,
  name: 'AWS eu-central-1',
};

const OTHER_LOCATION_OPTIONS = [
  { value: US_WEST_DEPLOYMENT, name: 'AWS us-west-2' },
  { value: CREODIAS_DEPLOYMENT, name: 'Creodias' },
  { value: CODEDE_DEPLOYMENT, name: 'Code-de' },
];

const ALL_OPTIONS = [BLANK_LOCATION_OPTION, AWS_LOCATION_OPTION, ...OTHER_LOCATION_OPTIONS];

const isByocLocationSupported = (location, appMode) => {
  return appMode === 'PROCESS' || location === EU_CENTRAL_DEPLOYMENT;
};
const BYOCOptions = ({
  token,
  byocCollectionLocation,
  byocCollectionType,
  byocCollectionId,
  appMode,
  idx,
}) => {
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
        store.dispatch(requestSlice.actions.setByocLocation({ idx, location }));
        store.dispatch(requestSlice.actions.setByocCollectionType({ idx, type }));
        handleSetTimeRange(type);
      }
    }
    store.dispatch(requestSlice.actions.setByocCollectionId({ id: value, idx }));
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
      addWarningAlert(getMessageFromApiError(err, 'Unable to load custom collections'));
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

  useEffect(() => {
    if (!isByocLocationSupported(byocCollectionLocation, appMode)) {
      store.dispatch(requestSlice.actions.setByocLocation({ idx, location: '' }));
    }
    // eslint-disable-next-line
  }, []);

  const handleByocLocationChange = (value) => {
    store.dispatch(requestSlice.actions.setByocLocation({ idx, location: value }));
  };

  const handleByocCollectionTypeChange = (value) => {
    handleSetTimeRange(value);
    store.dispatch(requestSlice.actions.setByocCollectionType({ idx, type: value }));
  };

  const handleRefreshCollections = () => {
    loadCustomCollections();
    store.dispatch(requestSlice.actions.setByocCollectionId({ idx, id: '' }));
  };

  return (
    <div className="form p-0">
      <label htmlFor={`collection-id-${idx}`} className="form__label mt-2">
        Collection Id
      </label>
      <div className="flex items-center mb-2">
        <input
          id={`collection-id-${idx}`}
          required
          value={byocCollectionId}
          onChange={handleCollectionIdChange}
          type="text"
          className="form__input mr-2"
          placeholder="Write your collection Id"
          list="collections-list"
        />
        {token && collections.length > 0 && generateCollectionDatalist(collections)}

        {token && (
          <button className="secondary-button" onClick={handleRefreshCollections}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>

      <Select
        label="Location"
        selected={byocCollectionLocation}
        onChange={handleByocLocationChange}
        buttonClassNames="mb-2"
        options={ALL_OPTIONS}
      />
      <Select
        label="Collection Type"
        selected={byocCollectionType}
        onChange={handleByocCollectionTypeChange}
        options={byocTypeOptions}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  token: state.auth.user.access_token,
  byocCollectionLocation: state.request.dataCollections[ownProps.idx].byocCollectionLocation,
  byocCollectionType: state.request.dataCollections[ownProps.idx].byocCollectionType,
  byocCollectionId: state.request.dataCollections[ownProps.idx].byocCollectionId,
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(BYOCOptions);
