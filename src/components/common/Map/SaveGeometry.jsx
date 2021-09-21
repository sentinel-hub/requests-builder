import React, { useState } from 'react';
import { SaveAsIcon } from '@heroicons/react/outline';
import { connect } from 'react-redux';
import bboxPolygon from '@turf/bbox-polygon';
import tokml from 'tokml';
import moment from 'moment';

import { isBbox } from './utils/geoUtils';
import { triggerDownload } from '../../statistical/response/HistogramChart';

const SaveGeometry = ({ convertedGeometry }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        className="secondary-button w-10 mr-2"
        title="Download Geometry"
        onClick={() => setIsOpen(true)}
      >
        <SaveAsIcon />
      </button>
    );
  }

  const handleSaveAs = (geoFormat) => () => {
    setIsOpen(false);
    let geometry = convertedGeometry;
    if (isBbox(convertedGeometry)) {
      geometry = bboxPolygon(convertedGeometry).geometry;
    }

    let link;
    if (geoFormat === 'geojson') {
      link = URL.createObjectURL(new Blob([JSON.stringify(geometry, null, 2)], { type: 'application/json' }));
    }
    // kml
    else {
      const kml = tokml(geometry);
      link = URL.createObjectURL(new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' }));
    }

    triggerDownload(link, `geometry_${moment.utc().format()}.${geoFormat}`);
    URL.revokeObjectURL(link);
  };

  return (
    <div className="flex">
      <button className="secondary-button ml-2 mr-2" onClick={handleSaveAs('geojson')}>
        GeoJson
      </button>
      <button className="secondary-button mr-2" onClick={handleSaveAs('kml')}>
        KML
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  convertedGeometry: state.map.convertedGeometry,
});

export default connect(mapStateToProps)(SaveGeometry);
