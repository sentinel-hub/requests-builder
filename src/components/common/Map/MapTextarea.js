import React, { useState, useEffect } from 'react';
import { kml } from '@tmcw/togeojson';
import store from '../../../store';
import mapSlice from '../../../store/map';
import { addWarningAlert } from '../../../store/alert';
import { crsByUrl } from '../../process/requests/parseRequest';
import Tooltip from '../Tooltip/Tooltip';
import SaveGeometry from './SaveGeometry';
import { getFeatureCollectionMultiPolygon } from './utils/geoUtils';

const isFeatureCollection = (parsedGeometry) => parsedGeometry.type === 'FeatureCollection';
const isFeature = (parsedGeometry) => parsedGeometry.type === 'Feature';
const isGeojson = (parsedGeometry) =>
  isFeatureCollection(parsedGeometry) || isFeature(parsedGeometry) === 'Feature';
const containsCrs = (parsedGeometry) => parsedGeometry.properties?.crs !== undefined;
const getCrsUrl = (parsedGeometry) => parsedGeometry.properties.crs;

const MapTextarea = ({ fitToMainBounds, extraGeometry, geometry, setParsedError, selectedCrs }) => {
  const [geometryText, setGeometryText] = useState('');

  const handleGeometryTextChange = (e) => {
    setGeometryText(e.target.value);
  };

  const handleParseGeometry = (text = geometryText) => {
    try {
      let parsedGeo = JSON.parse(text);
      // Geojson
      if (isGeojson) {
        if (containsCrs(parsedGeo)) {
          const selectedCrs = crsByUrl(getCrsUrl(parsedGeo));
          if (selectedCrs) {
            store.dispatch(mapSlice.actions.setSelectedCrs(selectedCrs));
          } else {
            throw Error('CRS not supported');
          }
        }
        if (isFeatureCollection(parsedGeo)) {
          const multiPolygon = getFeatureCollectionMultiPolygon(parsedGeo);
          console.log(multiPolygon);
          parsedGeo = multiPolygon;
        }
        if (isFeature(parsedGeo)) {
          parsedGeo = parsedGeo.geometry;
        }
      }
      store.dispatch(mapSlice.actions.setTextGeometry(parsedGeo));
    } catch (err) {
      addWarningAlert('Error parsing the geometry');
      console.error('Error Parsing Geometry', err);
    }
  };

  const handleParseGeometryClick = () => {
    if (selectedCrs === 'EPSG:4326') {
      setParsedError(false);
    } else {
      setParsedError(true);
    }
    handleParseGeometry();
  };

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
        store.dispatch(mapSlice.actions.setTextGeometry(converted.features[0].geometry));
      } else {
        handleParseGeometry(text);
      }
      // Reset file value to always detect change on upload.
      fileElement.value = '';
      if (selectedCrs === 'EPSG:4326') {
        setParsedError(false);
      } else {
        setParsedError(true);
      }
    } catch (err) {
      console.error('Error uploading file', err);
    }
  };

  const handleClearExtraGeometry = () => {
    store.dispatch(mapSlice.actions.setExtraGeometry(null));
    fitToMainBounds();
  };

  useEffect(() => {
    setGeometryText(JSON.stringify(geometry, null, 2));
  }, [geometry]);

  return (
    <div className="flex flex-col items-center h-5/6 w-full xl:w-1/3">
      <textarea
        className="h-48 xl:h-600 p-2 w-5/6 border-primary border outline-none focus:border-2 rounded-md"
        onChange={handleGeometryTextChange}
        value={geometryText}
        spellCheck="false"
      />
      <div className="flex items-center justify-center w-full mt-2">
        <SaveGeometry />
        <button onClick={handleParseGeometryClick} className="secondary-button w-fit mr-2">
          Parse
        </button>
        <input onChange={handleFileUpload} id="file-input" type="file" style={{ display: 'none' }} />
        <button
          title="Upload a KML or GeoJSON file to parse the geometry."
          onClick={handleUploadFileButtonClick}
          className="secondary-button wrapped w-fit mr-2"
        >
          Upload KML/GeoJSON
        </button>
        <Tooltip
          direction="left"
          content="Upload a KML or GeoJSON file to parse the geometry (Only first geometry on the file gets parsed)."
        />
        {extraGeometry ? (
          <button className="secondary-button wrapped w-fit ml-2" onClick={handleClearExtraGeometry}>
            Clear Extra Geometry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MapTextarea;
