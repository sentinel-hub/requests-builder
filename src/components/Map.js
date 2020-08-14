import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import bbox from '@turf/bbox';
import store, { requestSlice } from '../store';

//Get as props the reference to the map, the created layers and the drawn items.
const Map = ({ mapRef, layersRef, drawnItemsRef }) => {
  //equivalent to ComponentDidMount
  //Creates a map and adds neccesary configuration
  useEffect(() => {
    mapRef.current = L.map('map').setView([41.8952044, 12.4353407], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(mapRef.current);

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

    mapRef.current.on('pm:create', (e) => {
      const layer = e.layer;
      layer.removeFrom(mapRef.current);
      const shape = e.shape;
      const geoJSONFeature = layer.toGeoJSON();
      if (shape === 'Rectangle') {
        store.dispatch(requestSlice.actions.setGeometry(bbox(geoJSONFeature)));
      } else if (shape === 'Polygon') {
        store.dispatch(requestSlice.actions.setGeometry(geoJSONFeature.geometry));
      }
    });
  }, [drawnItemsRef, layersRef, mapRef]);

  return <div className="map" id="map"></div>;
};

export default Map;
