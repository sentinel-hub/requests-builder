import React, { useEffect, useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';

import Map from './Map';
import store from '../../../store';
import {
  getAreaFromGeometry,
  isBbox,
  isPolygon,
  transformGeometryToWGS84IfNeeded,
} from './utils/crsTransform';
import CRSSelection from './CRSSelection';
import MapTextarea from './MapTextarea';
import mapSlice from '../../../store/map';
import ByocDataFinder from './ByocDataFinder';

const getLeafletLayer = (wgs84Geometry, layerConfig, currentLayers, mapRef) => {
  // add event listener to layer
  const addEditEventListener = (layer, layerConfig) => {
    if (layerConfig) {
      return;
    }
    layer.on('pm:edit', (e) => {
      const layer = e.layer;
      const type = currentLayers[0].type;
      if (type === 'rectangle') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(bbox(layer.toGeoJSON())));
      } else if (type === 'polygon') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(layer.toGeoJSON().geometry));
      }
    });

    layer.on('pm:cut', (e) => {
      e.layer.removeFrom(mapRef);
      e.originalLayer.removeFrom(mapRef);
      let geo = e.layer.toGeoJSON().geometry;
      geo.type = 'MultiPolygon';
      geo.coordinates = [geo.coordinates];
      store.dispatch(mapSlice.actions.setWgs84Geometry(geo));
    });
  };
  try {
    if (wgs84Geometry.type === 'Polygon') {
      const coords = wgs84Geometry.coordinates[0].map((c) => [c[1], c[0]]);
      const polygon = L.polygon(coords, layerConfig);
      addEditEventListener(polygon, layerConfig);
      return {
        layer: polygon,
        type: 'polygon',
      };
    } else if (wgs84Geometry.type === 'MultiPolygon') {
      const coords = wgs84Geometry.coordinates.map((a) =>
        a.map((coords) => coords).map((b) => b.map((c) => [c[1], c[0]])),
      );
      const layer = L.polygon(coords, layerConfig);
      addEditEventListener(layer, layerConfig);
      return {
        layer: layer,
        type: 'polygon',
      };
    } else if (isBbox(wgs84Geometry)) {
      const coords = bboxPolygon(wgs84Geometry).geometry.coordinates[0].map((c) => [c[1], c[0]]);
      const polygon = L.rectangle(coords, layerConfig);
      addEditEventListener(polygon, layerConfig);
      return {
        layer: polygon,
        type: 'rectangle',
      };
    }
  } catch (err) {
    console.error('Error while creating the layer on GetLayer\n', err);
    return false;
  }
};

const MapContainer = ({ wgs84Geometry, selectedCrs, textGeometry, extraGeometry }) => {
  const mapRef = useRef();
  const layersRef = useRef([]);
  const drawnItemsRef = useRef();
  const [parsedError, setParsedError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [hasUsedMap, setHasUsedMap] = useState(false);

  useEffect(() => {
    if (hasUsedMap && selectedCrs !== 'EPSG:4326') {
      setMapError(true);
      setParsedError(false);
    }
    // eslint-disable-next-line
  }, [hasUsedMap]);

  useEffect(() => {
    if (parsedError && mapError) {
      setMapError(false);
      setHasUsedMap(false);
    }
    // eslint-disable-next-line
  }, [parsedError]);

  const addDrawLayer = (layerWithType, layersRef) => {
    const { layer, type } = layerWithType;
    if (layer && type) {
      drawnItemsRef.current.addLayer(layer);
      layersRef.push(layerWithType);
    } else {
      throw Error('Adding invalid layer');
    }
  };

  const deleteLayerIfPossible = () => {
    if (layersRef.current.length > 0) {
      const layerToBeRemoved = layersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };
  const deleteExtraLayerIfPossible = () => {
    if (extraLayersRef.current.length > 0) {
      const layerToBeRemoved = extraLayersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };

  //reference to layers no-related to redux geometry (tpdi)
  const extraLayersRef = useRef([]);

  // Polygon saved from swapping between bbox<->polygon
  const [polygonBeforeConversion, setPolygonBeforeConversion] = useState();

  const fitToMainBounds = useCallback(() => {
    if (layersRef.current.length > 0) {
      mapRef.current.fitBounds(layersRef.current[0].layer.getBounds());
    }
  }, []);
  const handleSwapToBbox = () => {
    setPolygonBeforeConversion(textGeometry);
    const bboxFromPoly = bbox(transformGeometryToWGS84IfNeeded(selectedCrs, textGeometry));
    store.dispatch(mapSlice.actions.setWgs84Geometry(bboxFromPoly));
  };

  useEffect(() => {
    const leafletLayer = getLeafletLayer(wgs84Geometry, undefined, layersRef.current, mapRef.current);
    deleteLayerIfPossible();
    addDrawLayer(leafletLayer, layersRef.current);
    mapRef.current.fitBounds(leafletLayer.layer.getBounds());
  }, [wgs84Geometry]);

  useEffect(() => {
    if (extraGeometry !== null) {
      const extraLeafletLayer = getLeafletLayer(
        extraGeometry,
        { color: 'green' },
        extraLayersRef.current,
        mapRef.current,
      );
      deleteExtraLayerIfPossible();
      addDrawLayer(extraLeafletLayer, extraLayersRef.current);
      mapRef.current.fitBounds(extraLeafletLayer.layer.getBounds());
    } else {
      deleteExtraLayerIfPossible();
    }
  }, [extraGeometry]);

  return (
    <div>
      <h2 className="heading-secondary">Area of interest</h2>
      <div className="form">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <CRSSelection selectedCrs={selectedCrs} />
          <p
            className="text"
            style={{ margin: '0 2rem', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <span>Area selected:</span> {(getAreaFromGeometry(wgs84Geometry) / 1e6).toFixed(2)} km<sup>2</sup>
          </p>
          {isPolygon(textGeometry) && (
            <button
              style={{ marginTop: '0', marginRight: '1rem' }}
              className="secondary-button"
              onClick={handleSwapToBbox}
            >
              Get bbox
            </button>
          )}
          {isBbox(textGeometry) && polygonBeforeConversion && (
            <button
              style={{ marginTop: '0', marginRight: '1rem' }}
              className="secondary-button"
              onClick={() => store.dispatch(mapSlice.actions.setTextGeometry(polygonBeforeConversion))}
            >
              Undo
            </button>
          )}
          <ByocDataFinder />
        </div>
        {(parsedError || mapError) && (
          <div style={{ marginBottom: '1rem' }}>
            {parsedError && (
              <p className="text text--warning" style={{ marginLeft: 'auto' }}>
                When parsing, the displayed geometry on the map can have some minor errors due to
                re-projection to EPSG:4326.
              </p>
            )}
            {mapError && (
              <p className="text text--warning">
                When drawing geometries in CRSs other than WGS:84 the resulting text geometry can have some
                minor errors due to re-projection to {selectedCrs}
              </p>
            )}
          </div>
        )}
        <div className="map-container" style={{ zIndex: '1' }}>
          <Map
            mapRef={mapRef}
            drawnItemsRef={drawnItemsRef}
            layersRef={layersRef}
            setHasUsedMap={setHasUsedMap}
          />

          <MapTextarea
            fitToMainBounds={fitToMainBounds}
            geometry={textGeometry}
            extraGeometry={extraGeometry}
            setParsedError={setParsedError}
            selectedCrs={selectedCrs}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  wgs84Geometry: state.map.wgs84Geometry,
  textGeometry: state.map.convertedGeometry,
  selectedCrs: state.map.selectedCrs,
  extraGeometry: state.map.extraGeometry,
});

export default connect(mapStateToProps)(MapContainer);
