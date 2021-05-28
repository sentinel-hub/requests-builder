import React, { useState, useEffect } from 'react';
import { kml } from '@tmcw/togeojson';
import store from '../../../store';
import mapSlice from '../../../store/map';
import { addWarningAlert } from '../../../store/alert';

const MapTextarea = ({ fitToMainBounds, extraGeometry, geometry, setParsedError, selectedCrs }) => {
  const [geometryText, setGeometryText] = useState('');

  const handleGeometryTextChange = (e) => {
    setGeometryText(e.target.value);
  };

  const handleParseGeometry = (text = geometryText) => {
    try {
      let parsedGeo = JSON.parse(text);
      // Geojson
      if (parsedGeo.type === 'FeatureCollection') {
        parsedGeo = parsedGeo.features[0].geometry;
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
    <div className="textarea-aoi-container">
      <textarea
        onChange={handleGeometryTextChange}
        value={geometryText}
        spellCheck="false"
        className="textarea"
      />
      <div className="map-buttons">
        <button onClick={handleParseGeometryClick} className="secondary-button">
          Parse
        </button>
        <input onChange={handleFileUpload} id="file-input" type="file" style={{ display: 'none' }} />
        <button
          title="Upload a KML or GeoJSON file to parse the geometry."
          onClick={handleUploadFileButtonClick}
          className="secondary-button secondary-button--wrapped"
        >
          Upload KML/GeoJSON
        </button>
        <span
          className="info"
          title="Upload a KML or GeoJSON file to parse the geometry (Only first geometry on the file gets parsed)."
        >
          &#8505;
        </span>
        {extraGeometry ? (
          <button className="secondary-button secondary-button--wrapped" onClick={handleClearExtraGeometry}>
            Clear Extra Geometry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MapTextarea;
