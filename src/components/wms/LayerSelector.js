import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getLayersByInstanceId } from './wmsRequests';
import store from '../../store';
import wmsSlice from '../../store/wms';

const generateLayersOptions = (layers) => {
  return layers.map((lay) => (
    <option key={lay.id} value={lay.id}>
      {lay.title}
    </option>
  ));
};

const LayerSelector = ({ layerId, instanceId, token }) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const loadLayers = async () => {
      if (!token || !instanceId) {
        return;
      }
      try {
        const res = await getLayersByInstanceId(token, instanceId);
        if (res.data) {
          setLayers(
            res.data.map((lay) => ({
              id: lay.id,
              description: lay.description,
              title: lay.title,
              datasource: lay.datasourceDefaults.type,
              otherDefaults: lay.datasourceDefaults,
            })),
          );
        }
      } catch (err) {
        console.error('Something went wrong loading layers', err);
      }
    };
    loadLayers();
  }, [instanceId, token]);

  const handleLayerIdChange = (e) => {
    store.dispatch(wmsSlice.actions.setLayerId(e.target.value));
  };

  const handleSelectLayerChange = (e) => {
    store.dispatch(wmsSlice.actions.setLayerId(e.target.value));
    store.dispatch(
      wmsSlice.actions.setDatasource(layers.find((lay) => lay.id === e.target.value).datasource),
    );
  };

  return (
    <>
      <label htmlFor="layer" className="form__label">
        Layer
      </label>
      <input
        id="layer"
        type="text"
        className="form__input"
        placeholder="Layer id"
        value={layerId}
        onChange={handleLayerIdChange}
      />
      {layers.length > 0 ? (
        <>
          <label htmlFor="instance-layers" className="form__label">
            Instance Layers
          </label>
          <select id="instance-layers" className="form__input" onChange={handleSelectLayerChange}>
            <option value="">Select an instance layer</option>
            {generateLayersOptions(layers)}
          </select>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  instanceId: state.wms.instanceId,
  token: state.auth.user.access_token,
  layerId: state.wms.layerId,
});

export default connect(mapStateToProps)(LayerSelector);
