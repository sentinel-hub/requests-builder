import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';

import Map from './Map';
import store, { requestSlice } from '../../../store';
import { transformGeometryToWGS84IfNeeded } from './utils/crsTransform';
import CRSSelection from './CRSSelection';
import MapTextarea from './MapTextarea';

//from parsed geometry to leaflet polygon / layer.
const getLayer = (parsedGeometry, layerConfig, currentLayers, mapRef) => {
  // function that adds event listeners on a given layer.
  const addEditEventListener = (layer, layerConfig) => {
    if (layerConfig) {
      return;
    }
    layer.on('pm:edit', (e) => {
      const layer = e.layer;
      const type = currentLayers[0].type;
      if (type === 'rectangle') {
        store.dispatch(requestSlice.actions.setGeometry(bbox(layer.toGeoJSON())));
      } else if (type === 'polygon') {
        store.dispatch(requestSlice.actions.setGeometry(layer.toGeoJSON().geometry));
      }
    });

    layer.on('pm:cut', (e) => {
      e.layer.removeFrom(mapRef);
      e.originalLayer.removeFrom(mapRef);
      let geo = e.layer.toGeoJSON().geometry;
      geo.type = 'MultiPolygon';
      geo.coordinates = [geo.coordinates];
      store.dispatch(requestSlice.actions.setGeometry(geo));
    });
  };
  try {
    if (parsedGeometry.type === 'Polygon') {
      //coordinates need to be swapped in order to work.
      const coords = parsedGeometry.coordinates[0].map((c) => [c[1], c[0]]);
      const polygon = L.polygon(coords, layerConfig);
      addEditEventListener(polygon, layerConfig);
      return {
        layer: polygon,
        type: 'polygon',
      };
    } else if (parsedGeometry.type === 'MultiPolygon') {
      const coords = parsedGeometry.coordinates.map((a) =>
        a.map((coords) => coords).map((b) => b.map((c) => [c[1], c[0]])),
      );
      const layer = L.polygon(coords, layerConfig);
      addEditEventListener(layer, layerConfig);
      return {
        layer: layer,
        type: 'polygon',
      };
    } else {
      const coords = bboxPolygon(parsedGeometry).geometry.coordinates[0].map((c) => [c[1], c[0]]);
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

export const convertToCRS84AndDispatch = (parsedGeo, selectedCrs) => {
  const transformedGeo = transformGeometryToWGS84IfNeeded(selectedCrs, parsedGeo);
  store.dispatch(requestSlice.actions.setGeometry(transformedGeo));
};

const MapContainer = ({ geometry, selectedCrs, extraMapGeometry }) => {
  const mapRef = useRef();
  const layersRef = useRef([]);
  const drawnItemsRef = useRef();
  //reference to layers no-related to redux geometry (tpdi)
  const extraLayersRef = useRef([]);

  // Parses geometry on textarea to layers on leaflet.
  // 1. Create leaflet layer based on geo 2. add it to drawn items 3. Fit Bounds to the new layer.
  const parseProperGeometryToMap = useCallback((parsedGeometry) => {
    const addDrawLayer = (layerWithType) => {
      const { layer, type } = layerWithType;
      if (layer && type) {
        drawnItemsRef.current.addLayer(layer);
        layersRef.current.push(layerWithType);
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

    try {
      const leafletLayer = getLayer(parsedGeometry, undefined, layersRef.current, mapRef.current);
      deleteLayerIfPossible();
      addDrawLayer(leafletLayer);
      mapRef.current.fitBounds(leafletLayer.layer.getBounds());
    } catch (err) {
      console.error('Parsing geometry failed', err);
    }
  }, []);

  const deleteExtraLayerIfPossible = () => {
    if (extraLayersRef.current.length > 0) {
      const layerToBeRemoved = extraLayersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };

  const parseExtraGeometryToMap = useCallback((parsedGeometry) => {
    const addExtraDrawLayer = (layerWithType) => {
      const { layer, type } = layerWithType;
      if (layer && type) {
        drawnItemsRef.current.addLayer(layer);
        extraLayersRef.current.push(layerWithType);
      } else {
        throw Error('Adding invalid layer');
      }
    };
    try {
      const leafletLayer = getLayer(
        parsedGeometry,
        { color: 'green' },
        extraLayersRef.current,
        mapRef.current,
      );
      deleteExtraLayerIfPossible();
      addExtraDrawLayer(leafletLayer);
      mapRef.current.fitBounds(leafletLayer.layer.getBounds());
    } catch (err) {
      console.error('Parsing extra geometry failed', err);
    }
  }, []);

  const fitToMainBounds = useCallback(() => {
    if (layersRef.current.length > 0) {
      mapRef.current.fitBounds(layersRef.current[0].layer.getBounds());
    }
  }, []);

  // Effect that converts internal geometry to Leaflet Layers visible on the Map.
  useEffect(() => {
    parseProperGeometryToMap(geometry);
  }, [geometry, parseProperGeometryToMap]);

  // Effect that converts internal extra-geometry to leaflet layers.
  useEffect(() => {
    if (extraMapGeometry) {
      parseExtraGeometryToMap(extraMapGeometry);
    } else {
      deleteExtraLayerIfPossible();
    }
  }, [extraMapGeometry, parseExtraGeometryToMap]);

  return (
    <div>
      <h2 className="heading-secondary">Area of interest</h2>
      <div className="form">
        <CRSSelection selectedCrs={selectedCrs} />

        <div className="map-container">
          <Map mapRef={mapRef} drawnItemsRef={drawnItemsRef} layersRef={layersRef} />

          <MapTextarea
            selectedCrs={selectedCrs}
            fitToMainBounds={fitToMainBounds}
            geometry={geometry}
            extraMapGeometry={extraMapGeometry}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  geometry: state.request.geometry,
  selectedCrs: state.request.CRS,
  extraMapGeometry: state.tpdi.extraMapGeometry,
});

export default connect(mapStateToProps)(MapContainer);
