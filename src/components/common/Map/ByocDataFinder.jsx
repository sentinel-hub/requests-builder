import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

import store from '../../../store';
import { addWarningAlert } from '../../../store/alert';
import mapSlice from '../../../store/map';
import RequestButton from '../RequestButton';
import CatalogResource from '../../../api/catalog/CatalogResource';
import { CUSTOM } from '../../../utils/const/const';

const ByocDataFinder = ({
  datasource,
  processCollectionId,
  processCollectionType,
  token,
  appMode,
  wmsCollectionId,
  wmsCollectionType,
}) => {
  const [foundFeatures, setFoundFeatures] = useState([]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);

  const collectionId = appMode === 'WMS' ? wmsCollectionId : processCollectionId;
  const collectionType = appMode === 'WMS' ? wmsCollectionType : processCollectionType;

  useEffect(() => {
    setFoundFeatures([]);
    setSelectedFeatureIndex(null);
  }, [processCollectionId, wmsCollectionId]);

  if (!((appMode === 'PROCESS' || appMode === 'BATCH') && datasource === CUSTOM) && !(appMode === 'WMS')) {
    return null;
  }

  const handleFindData = (data) => {
    if (data.features?.length > 0) {
      const geometries = data.features.map((feat) => omit(feat.geometry, ['crs']));
      setFoundFeatures(geometries);
      setSelectedFeatureIndex(0);
      store.dispatch(mapSlice.actions.setExtraGeometry(geometries[0]));
    } else {
      addWarningAlert('No features found in the collection');
    }
  };

  const errorHandler = (err) => {
    addWarningAlert('Something went wrong when searching for BYOC tiles');
    console.error(err);
  };

  const handleSetGeometry = () => {
    store.dispatch(mapSlice.actions.setWgs84Geometry(foundFeatures[selectedFeatureIndex]));
    store.dispatch(mapSlice.actions.setExtraGeometry(null));
  };

  return (
    <>
      {foundFeatures.length > 1 && selectedFeatureIndex > 0 && (
        <button
          className="secondary-button"
          style={{ marginTop: '0', borderRight: '1px dotted black' }}
          title="Previous Tile"
          onClick={() => {
            setSelectedFeatureIndex((prev) => prev - 1);
            store.dispatch(mapSlice.actions.setExtraGeometry(foundFeatures[selectedFeatureIndex - 1]));
          }}
        >
          &lt;
        </button>
      )}
      {selectedFeatureIndex === null ? (
        <RequestButton
          buttonText="Find BYOC Data"
          request={CatalogResource.fetchBounds}
          args={[{ collectionType: collectionType.toLowerCase(), collectionId }]}
          className="secondary-button"
          validation={Boolean(collectionId, collectionType, token)}
          disabledTitle="Log in and set a collection to use this"
          style={{ marginTop: '0' }}
          responseHandler={handleFindData}
          errorHandler={errorHandler}
        />
      ) : (
        <button className="secondary-button" style={{ marginTop: '0' }} onClick={handleSetGeometry}>
          Set Geometry
        </button>
      )}
      {foundFeatures.length > 1 && selectedFeatureIndex < foundFeatures.length - 1 && (
        <button
          className="secondary-button"
          style={{ marginTop: '0', borderLeft: '1px dotted black' }}
          title="Next Tile"
          onClick={() => {
            setSelectedFeatureIndex((prev) => prev + 1);
            store.dispatch(mapSlice.actions.setExtraGeometry(foundFeatures[selectedFeatureIndex + 1]));
          }}
        >
          &gt;
        </button>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  datasource: state.request.datasource,
  processCollectionId: state.request.byocCollectionId,
  processCollectionType: state.request.byocCollectionType,
  wmsCollectionId: state.wms.layer.otherDefaults?.collectionId ?? null,
  wmsCollectionType: state.wms.layer.otherDefaults?.subType ?? 'BYOC',
  token: state.auth.user.access_token,
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(ByocDataFinder);
