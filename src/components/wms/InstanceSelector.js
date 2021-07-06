import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { getAllInstances } from './wmsRequests';
import store from '../../store';
import wmsSlice from '../../store/wms';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

const generateInstanceOptions = (instances) => {
  return instances
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map((instance) => (
      <option value={instance.id} key={instance.id}>
        {instance.name}
      </option>
    ));
};

const InstanceSelector = ({ token, instanceId }) => {
  const [instances, setInstances] = useState([]);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const sourceRef = useRef();

  const loadInstances = useCallback(async () => {
    sourceRef.current = Axios.CancelToken.source();
    try {
      const res = await getAllInstances(token, { cancelToken: sourceRef.current.token });
      if (res.data) {
        setInstances(
          res.data.map((instance) => ({
            name: instance.name,
            id: instance.id,
            created: instance.created,
          })),
        );
      }
    } catch (err) {
      if (!Axios.isCancel(err)) {
        console.error(err);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadInstances();
    }
    return () => {
      if (sourceRef.current) {
        sourceRef.current.cancel();
      }
    };
  }, [token, loadInstances]);

  const handleInstanceIdChange = (e) => {
    store.dispatch(wmsSlice.actions.setInstanceId(e.target.value));
  };

  const handleSelectInstanceId = (e) => {
    if (e.target.value === 'MANUAL') {
      setIsManualEntry(true);
      store.dispatch(wmsSlice.actions.setShouldFetchLayers(false));
    } else if (e.target.value === 'SELECT') {
      setIsManualEntry(false);
      store.dispatch(wmsSlice.actions.setInstanceId(''));
      store.dispatch(wmsSlice.actions.setShouldFetchLayers(false));
    } else {
      setIsManualEntry(false);
      store.dispatch(wmsSlice.actions.setInstanceId(e.target.value));
      store.dispatch(wmsSlice.actions.setShouldFetchLayers(true));
    }
  };

  const handleRefreshInstances = () => {
    if (token) {
      setInstances([]);
      store.dispatch(wmsSlice.actions.setInstanceId(''));
      loadInstances();
    }
  };

  const instanceIdToSelectValue = (instanceId) => {
    if (isManualEntry) {
      return 'MANUAL';
    }
    if (instanceId === '') {
      return 'SELECT';
    }
    return instanceId;
  };
  return (
    <>
      <label htmlFor="instance" className="form__label">
        Instance
      </label>
      <div className="flex items-center mb-1">
        <select
          id="personal-instances"
          onChange={handleSelectInstanceId}
          value={instanceIdToSelectValue(instanceId)}
          className="form__input"
        >
          <option value="MANUAL">Manual Entry</option>
          <option value="SELECT">Select an instance</option>
          {instances.length > 0 && (
            <optgroup label="Personal Instances">{generateInstanceOptions(instances)}</optgroup>
          )}
        </select>
        {token && (
          <button className="secondary-button ml-1" onClick={handleRefreshInstances}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>
      {isManualEntry && (
        <input
          id="instance"
          className="form__input"
          placeholder="Enter your instance id"
          type="text"
          onChange={handleInstanceIdChange}
          value={instanceId}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  instanceId: state.wms.instanceId,
});

export default connect(mapStateToProps)(InstanceSelector);
