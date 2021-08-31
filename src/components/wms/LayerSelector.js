import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchEvalscripts } from './wmsRequests';
import store from '../../store';
import wmsSlice from '../../store/wms';
import WmsResource from '../../api/wms/WmsResource';
import { CUSTOM, OLD_DATASOURCES_TO_NEW_MAP } from '../../utils/const/const';
import FieldWithManualEntry from '../common/FieldWithManualEntry';
import { checkValidUuid } from '../../utils/stringUtils';

const generateLayersOptions = (layers) => {
  return layers.map((lay) => ({
    name: lay.title,
    value: lay.id,
  }));
};

const LayerSelector = ({ layerId, instanceId, shouldFetchLayers, token }) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const loadLayers = async () => {
      if (!token || !instanceId || !checkValidUuid(instanceId)) {
        return;
      }
      try {
        const res = await WmsResource.getLayers({ instanceId });
        if (res.data) {
          // run through layers and fetch evalscripts if needed (dataproduct);
          const layersWithEvalscripts = await fetchEvalscripts(res.data, token);
          const resLayers = layersWithEvalscripts.map((lay) => ({
            id: lay.id,
            description: lay.description,
            title: lay.title,
            datasource: lay.datasourceDefaults.type,
            otherDefaults: lay.datasourceDefaults,
            styles: lay.styles,
          }));
          setLayers(resLayers);
          // in case of parsing
          const currentLayer = resLayers.find((lay) => lay.id === layerId);
          if (currentLayer) {
            selectLayerStateChanges(currentLayer);
          }
        }
      } catch (err) {
        console.error('Something went wrong loading layers', err);
      }
    };
    loadLayers();
    // eslint-disable-next-line
  }, [instanceId, token]);

  const selectLayerStateChanges = (layer) => {
    store.dispatch(wmsSlice.actions.setLayer(layer));
    const id = OLD_DATASOURCES_TO_NEW_MAP[layer.datasource];
    if (id === CUSTOM) {
      store.dispatch(
        wmsSlice.actions.setByocCollection({
          type: layer.otherDefaults.subType ?? 'BYOC',
          id: layer.otherDefaults.collectionId,
        }),
      );
    }
    store.dispatch(wmsSlice.actions.setDatasource(id));
  };
  const handleLayerIdChange = (value) => {
    const foundLayer = layers.find((lay) => lay.id === value);
    if (foundLayer !== undefined) {
      selectLayerStateChanges(foundLayer);
    } else {
      store.dispatch(wmsSlice.actions.setLayer({ id: value }));
    }
  };

  return (
    <>
      <label htmlFor="layer" className="form__label mt-2">
        Layer
      </label>
      <FieldWithManualEntry
        options={generateLayersOptions(layers)}
        value={layerId}
        onChange={handleLayerIdChange}
      />
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
