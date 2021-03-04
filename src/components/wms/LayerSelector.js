import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchEvalscripts, getLayersByInstanceId } from './wmsRequests';
import store from '../../store';
import wmsSlice from '../../store/wms';
import { useDidMountEffect } from '../../utils/hooks';

const generateLayersOptions = (layers) => {
  return layers.map((lay) => (
    <option key={lay.id} value={lay.id}>
      {lay.title}
    </option>
  ));
};

const LayerSelector = ({ layerId, instanceId, token }) => {
  const [layers, setLayers] = useState([]);
  const [layerIdInput, setLayerIdInput] = useState(layerId);

  useEffect(() => {
    const loadLayers = async () => {
      if (!token || !instanceId) {
        return;
      }
      try {
        const res = await getLayersByInstanceId(token, instanceId);
        if (res.data) {
          // run through layers and fetch evalscripts if needed (dataproduct);
          const layersWithEvalscripts = await fetchEvalscripts(res.data, token);
          setLayers(
            layersWithEvalscripts.map((lay) => ({
              id: lay.id,
              description: lay.description,
              title: lay.title,
              datasource: lay.datasourceDefaults.type,
              otherDefaults: lay.datasourceDefaults,
              styles: lay.styles,
            })),
          );
        }
      } catch (err) {
        console.error('Something went wrong loading layers', err);
      }
    };
    loadLayers();
  }, [instanceId, token]);

  useDidMountEffect(() => {
    setLayerIdInput('');
    store.dispatch(wmsSlice.actions.setLayer({}));
  }, [instanceId]);

  const handleLayerIdChange = (e) => {
    setLayerIdInput(e.target.value);
    const foundLayer = layers.find((lay) => lay.id === e.target.value);
    if (foundLayer !== undefined) {
      store.dispatch(wmsSlice.actions.setLayer(foundLayer));
    }
  };

  const handleSelectLayerChange = (e) => {
    setLayerIdInput(e.target.value);
    const layer = layers.find((lay) => lay.id === e.target.value);
    store.dispatch(wmsSlice.actions.setDatasource(layer.datasource));
    store.dispatch(wmsSlice.actions.setLayer(layer));
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
        value={layerIdInput}
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
  layerId: state.wms.layer.id ?? '',
});

export default connect(mapStateToProps)(LayerSelector);
