import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

import store from '../../../store';
import { addWarningAlert } from '../../../store/alert';
import mapSlice from '../../../store/map';
import RequestButton from '../RequestButton';
import CatalogResource from '../../../api/catalog/CatalogResource';
import { CUSTOM, EU_CENTRAL_DEPLOYMENT } from '../../../utils/const/const';
import { getMessageFromApiError } from '../../../api';

const ByocDataFinder = ({ dataCollections, token, appMode, wmsCollectionId, wmsCollectionType }) => {
  const [foundFeatures, setFoundFeatures] = useState([]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const byocDataCollection = useMemo(() => {
    return dataCollections.find((dt) => dt.type === CUSTOM);
  }, [dataCollections]);

  const collectionId = appMode === 'WMS' ? wmsCollectionId : byocDataCollection?.byocCollectionId;
  const collectionType = appMode === 'WMS' ? wmsCollectionType : byocDataCollection?.byocCollectionType;
  const location = appMode === 'WMS' ? EU_CENTRAL_DEPLOYMENT : byocDataCollection?.byocCollectionLocation;

  useEffect(() => {
    setFoundFeatures([]);
    setSelectedFeatureIndex(null);
  }, [collectionId]);

  if (!((appMode === 'PROCESS' || appMode === 'BATCH') && byocDataCollection) && !(appMode === 'WMS')) {
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
    addWarningAlert(getMessageFromApiError(err, 'Something went wrong fetching tiles for the collection.'));
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
          request={CatalogResource.fetchBounds(location)}
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
  dataCollections: state.request.dataCollections,
  wmsCollectionId: state.wms.layer.otherDefaults?.collectionId ?? null,
  wmsCollectionType: state.wms.layer.otherDefaults?.subType ?? 'BYOC',
  token: state.auth.user.access_token,
  appMode: state.request.mode,
});

export default connect(mapStateToProps)(ByocDataFinder);
