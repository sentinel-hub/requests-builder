import React, { useCallback, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import bbox from '@turf/bbox';
import store from '../../../store';
import mapSlice from '../../../store/map';

//Get as props the reference to the map, the created layers and the drawn items.
const Map = ({
  mapRef,
  layersRef,
  isDrawingMultiPolygon,
  drawnItemsRef,
  mapOverrideStyles,
  setHasUsedMap,
}) => {
  const normalEventHandler = useCallback(
    (e) => {
      const layer = e.layer;
      layer.removeFrom(mapRef.current);
      const shape = e.shape;
      const geoJSONFeature = layer.toGeoJSON();
      setHasUsedMap(true);
      if (shape === 'Rectangle') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(bbox(geoJSONFeature)));
      } else if (shape === 'Polygon') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(geoJSONFeature.geometry));
      }
    },
    [mapRef, setHasUsedMap],
  );

  const multipolygonEventHandler = useCallback(
    (e) => {
      const layer = e.layer;
      layer.removeFrom(mapRef.current);
      const geoJsonLayer = layer.toGeoJSON();
      store.dispatch(mapSlice.actions.appendWgs84Polygon(geoJsonLayer.geometry));
    },
    [mapRef],
  );

  //equivalent to ComponentDidMount
  //Creates a map and adds neccesary configuration
  useEffect(() => {
    mapRef.current = L.map('map').setView([41.8952044, 12.4353407], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(mapRef.current);

    L.control.scale().addTo(mapRef.current);

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    mapRef.current.addLayer(drawnItems);

    mapRef.current.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      drawPolyline: false,
      removalMode: false,
    });

    mapRef.current.on('pm:create', normalEventHandler);
  }, [drawnItemsRef, layersRef, mapRef, normalEventHandler]);

  // takes care of setting appropriate create layer handler in case of drawing multipolygons
  useEffect(() => {
    if (isDrawingMultiPolygon) {
      mapRef.current.off('pm:create', normalEventHandler);
      mapRef.current.on('pm:create', multipolygonEventHandler);
    } else {
      mapRef.current.off('pm:create', multipolygonEventHandler);
      mapRef.current.on('pm:create', normalEventHandler);
    }
  }, [isDrawingMultiPolygon, mapRef, multipolygonEventHandler, normalEventHandler]);

  return <div className="map" id="map" style={mapOverrideStyles}></div>;
};

export default Map;
