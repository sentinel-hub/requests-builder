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

const LayerSelector = ({ layerId, instanceId, shouldFetchLayers, token }) => {
  const [layers, setLayers] = useState([]);
  const [layerIdInput, setLayerIdInput] = useState(layerId);
  const [isOnManualInput, setIsOnManualInput] = useState(false);

  useEffect(() => {
    const loadLayers = async () => {
      if (!token || !instanceId || !shouldFetchLayers) {
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
  }, [instanceId, token, shouldFetchLayers]);

  useDidMountEffect(() => {
    setLayerIdInput('');
    store.dispatch(wmsSlice.actions.setLayer({}));
  }, [instanceId]);

  const handleLayerIdChange = (e) => {
    setLayerIdInput(e.target.value);
    const foundLayer = layers.find((lay) => lay.id === e.target.value);
    if (foundLayer !== undefined) {
      store.dispatch(wmsSlice.actions.setLayer(foundLayer));
    } else {
      store.dispatch(wmsSlice.actions.setLayer({ id: e.target.value }));
    }
  };

  const handleSelectLayerChange = (e) => {
    if (e.target.value === 'MANUAL') {
      setIsOnManualInput(true);
      setLayerIdInput('');
      store.dispatch(wmsSlice.actions.setLayer({}));
    } else if (e.target.value === 'SELECT') {
      setIsOnManualInput(false);
      setLayerIdInput('');
      store.dispatch(wmsSlice.actions.setLayer({}));
    } else {
      setIsOnManualInput(false);
      setLayerIdInput(e.target.value);
      const layer = layers.find((lay) => lay.id === e.target.value);
      if (layer) {
        store.dispatch(wmsSlice.actions.setDatasource(layer.datasource));
        store.dispatch(wmsSlice.actions.setLayer(layer));
      }
    }
  };

  const layerIdToSelectValue = (layerId) => {
    if (isOnManualInput) {
      return 'MANUAL';
    }
    if (layerId === '') {
      return 'SELECT';
    }

    return layerId;
  };

  return (
    <>
      <label htmlFor="layer" className="form__label mt-2">
        Layer
      </label>
      <select
        id="instance-layers"
        className="form__input"
        value={layerIdToSelectValue(layerId)}
        onChange={handleSelectLayerChange}
      >
        <option value="SELECT">Select an instance layer</option>
        <option value="MANUAL">Manual Entry</option>
        {layers.length > 0 && <optgroup label="Instance layers">{generateLayersOptions(layers)}</optgroup>}
      </select>
      {isOnManualInput && (
        <input
          id="layer"
          type="text"
          className="form__input my-2"
          placeholder="Layer id"
          value={layerIdInput}
          onChange={handleLayerIdChange}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  instanceId: state.wms.instanceId,
  shouldFetchLayers: state.wms.shouldFetchLayers,
  token: state.auth.user.access_token,
  layerId: state.wms.layer.id ?? '',
});

export default connect(mapStateToProps)(LayerSelector);
