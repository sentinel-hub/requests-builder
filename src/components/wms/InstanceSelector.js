import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import WmsResource from '../../api/wms/WmsResource';
import FieldWithManualEntry from '../common/FieldWithManualEntry';
import { checkValidUuid } from '../../utils/stringUtils';

const generateInstanceOptions = (instances) => {
  return instances
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map((instance) => ({
      name: instance.name,
      value: instance.id,
    }));
};

const InstanceSelector = ({ token, instanceId }) => {
  const [instances, setInstances] = useState([]);
  const sourceRef = useRef();

  const loadInstances = useCallback(async () => {
    sourceRef.current = Axios.CancelToken.source();
    try {
      const res = await WmsResource.getInstances({ cancelToken: sourceRef.current.token });
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
  }, []);

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

  const handleInstanceIdChange = (value) => {
    store.dispatch(wmsSlice.actions.setInstanceId(value));
    if (checkValidUuid(value)) {
      store.dispatch(wmsSlice.actions.setLayer({}));
    }
  };

  const handleRefreshInstances = () => {
    if (token) {
      setInstances([]);
      store.dispatch(wmsSlice.actions.setInstanceId(''));
      store.dispatch(wmsSlice.actions.setLayer({}));
      store.dispatch(wmsSlice.actions.setDatasource(''));
      loadInstances();
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <label htmlFor="instance" className="form__label">
          Instance
        </label>
        {token && (
          <button className="secondary-button ml-1" onClick={handleRefreshInstances}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>
      <div className="flex mb-2 flex-col">
        <FieldWithManualEntry
          options={generateInstanceOptions(instances)}
          onChange={handleInstanceIdChange}
          value={instanceId}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  instanceId: state.wms.instanceId,
});

export default connect(mapStateToProps)(InstanceSelector);
