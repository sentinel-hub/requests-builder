import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllInstances } from './wmsRequests';
import store, { wmsSlice } from '../../store';
import Axios from 'axios';

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

  useEffect(() => {
    let source = Axios.CancelToken.source();

    const loadInstances = async () => {
      try {
        const res = await getAllInstances(token, { cancelToken: source.token });
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
    };
    if (token) {
      loadInstances();
    }

    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [token]);

  const handleInstanceIdChange = (e) => {
    store.dispatch(wmsSlice.actions.setInstanceId(e.target.value));
  };

  const handleSelectInstanceId = (e) => {
    store.dispatch(wmsSlice.actions.setInstanceId(e.target.value));
  };
  return (
    <>
      <label htmlFor="instance" className="form__label">
        Instance
      </label>
      <input
        id="instance"
        className="form__input"
        placeholder="Enter your instance id"
        type="text"
        onChange={handleInstanceIdChange}
        value={instanceId}
      />
      {!token ? <p className="text">Log in to see your personal instances</p> : null}
      {instances.length > 0 ? (
        <label htmlFor="personal-instances" className="form__label">
          Personal Instances
        </label>
      ) : null}
      {instances.length > 0 ? (
        <select id="personal-instances" onChange={handleSelectInstanceId} className="form__input">
          <option value="">Select an instance</option>
          {generateInstanceOptions(instances)}
        </select>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  instanceId: state.wms.instanceId,
});

export default connect(mapStateToProps)(InstanceSelector);
