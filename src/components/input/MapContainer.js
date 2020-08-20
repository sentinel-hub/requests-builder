import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map from '../Map';
import { connect } from 'react-redux';
import { CRS } from '../../utils/const';
import store, { requestSlice, tpdiSlice } from '../../store';
import { transformGeometryToNewCrs } from '../../utils/crsTransform';
import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';
import area from '@turf/area';
import { kml } from '@tmcw/togeojson';

//Helper functions.
// Parsed Geo in whatever CRS -> Parsed Geo in WGS84
export const transformGeometryToWGS84IfNeeded = (selectedCRS, geometry) => {
  //transform if not in WGS84
  if (selectedCRS !== 'EPSG:4326') {
    try {
      const newGeo = transformGeometryToNewCrs(geometry, 'EPSG:4326', selectedCRS);
      return newGeo;
    } catch (err) {
      return geometry;
    }
  }
  return geometry;
};

export const getAreaFromGeometry = (geometry) => {
  if (geometry.length === 4) {
    return area(bboxPolygon(geometry));
  } else {
    return area(geometry);
  }
};

//from parsed geometry to leaflet polygon / layer.
const getLayer = (parsedGeometry, layerConfig, currentLayers, mapRef) => {
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
    console.error('error while creating the layer on GetLayer\n', err);
    return false;
  }
};

const generateCRSOptions = (crs) =>
  Object.keys(crs)
    .map((key) =>
      !crs[key].internal ? (
        <option key={key} value={key}>
          {key}
        </option>
      ) : undefined,
    )
    .filter((o) => o);

const convertToCRS84AndDispatch = (parsedGeo, selectedCrs) => {
  const transformedGeo = transformGeometryToWGS84IfNeeded(selectedCrs, parsedGeo);
  store.dispatch(requestSlice.actions.setGeometry(transformedGeo));
};

export const focusMap = () => {
  document.getElementById('map').focus();
};

//Component
const MapContainer = ({ geometry, selectedCrs, extraMapGeometry }) => {
  //functions for leaflet map.
  const deleteLayerIfPossible = () => {
    if (layersRef.current.length > 0) {
      const layerToBeRemoved = layersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };

  const addDrawLayer = (layerWithType) => {
    const { layer, type } = layerWithType;
    if (layer && type) {
      drawnItemsRef.current.addLayer(layer);
      layersRef.current.push(layerWithType);
    } else {
      throw Error('Adding invalid layer');
    }
  };

  // Helpers for TPDI layers
  const deleteExtraLayerIfPossible = () => {
    if (extraLayersRef.current.length > 0) {
      const layerToBeRemoved = extraLayersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };
  const addExtraDrawLayer = (layerWithType) => {
    const { layer, type } = layerWithType;
    if (layer && type) {
      drawnItemsRef.current.addLayer(layer);
      extraLayersRef.current.push(layerWithType);
    } else {
      throw Error('Adding invalid layer');
    }
  };

  const [geometryText, setGeometryText] = useState('');
  const layersRef = useRef([]);
  //reference to layers no-related to redux geometry (tpdi)
  const extraLayersRef = useRef([]);
  const drawnItemsRef = useRef();
  const mapRef = useRef();

  const handleCRSChange = (e) => {
    store.dispatch(requestSlice.actions.setCRS(e.target.value));
  };

  const handleGeometryTextChange = (e) => {
    setGeometryText(e.target.value);
  };

  // Parses geometry on textarea to layers on leaflet.
  // 1. Create leaflet layer based on geo 2. add it to drawn items 3. Fit Bounds to the new layer.
  const parseProperGeometryToMap = useCallback((parsedGeometry) => {
    try {
      const leafletLayer = getLayer(parsedGeometry, undefined, layersRef.current, mapRef.current);
      deleteLayerIfPossible();
      addDrawLayer(leafletLayer);
      mapRef.current.fitBounds(leafletLayer.layer.getBounds());
    } catch (err) {
      console.error('Parsing geometry failed', err);
    }
  }, []);

  const parseExtraGeometryToMap = useCallback((parsedGeometry) => {
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

  const handleParseGeometry = (text = geometryText) => {
    try {
      let parsedGeo = JSON.parse(text);
      // Geojson
      if (parsedGeo.type === 'FeatureCollection') {
        parsedGeo = parsedGeo.features[0].geometry;
      }
      convertToCRS84AndDispatch(parsedGeo, selectedCrs);
    } catch (err) {
      console.error('Error Parsing Geometry', err);
    }
  };

  //Effect that handles transforming into the selected CRS the internal geometry and keeping the textarea updated.
  useEffect(() => {
    if (selectedCrs !== 'EPSG:4326') {
      const transformedGeo = transformGeometryToNewCrs(geometry, selectedCrs);
      setGeometryText(JSON.stringify(transformedGeo, null, 2));
    } else {
      setGeometryText(JSON.stringify(geometry, null, 2));
    }
  }, [geometry, selectedCrs]);

  // Effect that converts internal geometry to Leaflet Layers visible on the Map.
  useEffect(() => {
    parseProperGeometryToMap(geometry);
  }, [geometry, parseProperGeometryToMap]);

  // Effect that shows extra geometry layers (for tpdi)
  useEffect(() => {
    if (extraMapGeometry) {
      parseExtraGeometryToMap(extraMapGeometry);
    } else {
      deleteExtraLayerIfPossible();
    }
  }, [extraMapGeometry, parseExtraGeometryToMap]);

  const handleUploadFileButtonClick = () => {
    let fileElement = document.getElementById('file-input');
    fileElement.click();
  };

  const handleFileUpload = async () => {
    try {
      let fileElement = document.getElementById('file-input');
      let file = fileElement.files[0];
      let text = await file.text();
      let ext = file.name.split('.').pop();
      if (file.type.includes('kml') || ext === 'kml') {
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/xml');
        let converted = kml(doc);
        convertToCRS84AndDispatch(converted.features[0].geometry, selectedCrs);
      } else {
        handleParseGeometry(text);
      }
      fileElement.value = '';
    } catch (err) {
      console.error('Error uploading file', err);
    }
  };

  const handleClearExtraGeometry = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(null));
    fitToMainBounds();
  };

  return (
    <div className="aoi-container">
      <h2 className="heading-secondary">Area of interest</h2>
      <div className="form">
        <div className="form__item form__item--crs" style={{ display: 'flex', alignItems: 'center' }}>
          <label className="form__label">CRS: </label>
          <select
            className="form__input"
            style={{ transform: 'translateY(-5px)', marginLeft: '1rem' }}
            onChange={handleCRSChange}
            value={selectedCrs}
          >
            {generateCRSOptions(CRS)}
          </select>
        </div>
        <div className="map-container">
          <Map mapRef={mapRef} drawnItemsRef={drawnItemsRef} layersRef={layersRef} />
          <div className="textarea-aoi-container">
            <textarea
              onChange={handleGeometryTextChange}
              value={geometryText}
              spellCheck="false"
              className="textarea"
            />
            <div className="map-buttons">
              <button onClick={() => handleParseGeometry()} className="secondary-button">
                Parse Geometry
              </button>
              <input onChange={handleFileUpload} id="file-input" type="file" style={{ display: 'none' }} />
              <button
                title="Upload a KML or GeoJSON file to parse the geometry."
                onClick={handleUploadFileButtonClick}
                className="secondary-button"
              >
                Upload KML/GeoJSON
              </button>
              <span
                className="info"
                title="Upload a KML or GeoJSON file to parse the geometry (Only first geometry on the file gets parsed)."
              >
                &#8505;
              </span>
              {extraMapGeometry ? (
                <button className="secondary-button" onClick={handleClearExtraGeometry}>
                  Clear Extra Geometry
                </button>
              ) : null}
            </div>
          </div>
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
