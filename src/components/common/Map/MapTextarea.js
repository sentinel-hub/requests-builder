import React, { useState, useEffect } from 'react';
import { kml } from '@tmcw/togeojson';
import { convertToCRS84AndDispatch } from './MapContainer';
import store from '../../../store';
import tpdiSlice from '../../../store/tpdi';
import { transformGeometryToNewCrs } from './utils/crsTransform';

const MapTextarea = ({ selectedCrs, fitToMainBounds, extraMapGeometry, geometry }) => {
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
      convertToCRS84AndDispatch(parsedGeo, selectedCrs);
    } catch (err) {
      console.error('Error Parsing Geometry', err);
    }
  };

  const handleParseGeometryClick = () => {
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
        convertToCRS84AndDispatch(converted.features[0].geometry, selectedCrs);
      } else {
        handleParseGeometry(text);
      }
      // Reset file value to always detect change on upload.
      fileElement.value = '';
    } catch (err) {
      console.error('Error uploading file', err);
    }
  };

  const handleClearExtraGeometry = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(null));
    fitToMainBounds();
  };

  useEffect(() => {
    if (selectedCrs !== 'EPSG:4326') {
      const transformedGeo = transformGeometryToNewCrs(geometry, selectedCrs);
      setGeometryText(JSON.stringify(transformedGeo, null, 2));
    } else {
      setGeometryText(JSON.stringify(geometry, null, 2));
    }
  }, [geometry, selectedCrs]);

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
        {extraMapGeometry ? (
          <button className="secondary-button" onClick={handleClearExtraGeometry}>
            Clear Extra Geometry
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MapTextarea;
