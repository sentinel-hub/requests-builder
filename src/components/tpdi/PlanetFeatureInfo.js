import React, { useState } from 'react';
import { formatPercentage } from '../../utils/stringUtils';
import TPDIThumbnail from './TPDIThumbnail';
import TpdiSearchResultHeader from './TpdiSearchResultHeader';

const PlanetFeatureInfo = ({ feature }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);
  return (
    <div className="tpdi-feature">
      <TpdiSearchResultHeader
        date={feature.properties?.acquired}
        id={feature.id}
        featureGeometry={feature.geometry}
        setExpandedInfo={setExpandedInfo}
        expandedInfo={expandedInfo}
      />
      {expandedInfo ? (
        <div className="flex items-center">
          <div className="tpdi-feature-extra-info mb-1">
            <p className="text">
              <span>Acquisition Date: </span>
              {feature.properties?.acquired}
            </p>
            <p className="text">
              <span>Product geometry coverage: </span>
              {formatPercentage(feature.areaCoverage)}
            </p>
            {feature.properties?.cloud_cover !== undefined && (
              <p className="text">
                <span>Cloud Cover: </span>
                {formatPercentage(feature.properties?.cloud_cover)}
              </p>
            )}
            {feature.properties?.snow_ice_percent !== undefined && (
              <p className="text">
                <span>Snow Cover: </span>
                {feature.properties?.snow_ice_percent.toFixed(2) + '%'}
              </p>
            )}
            {feature.properties?.shadow_percent !== undefined && (
              <p className="text">
                <span>Shadow Percent: </span>
                {feature.properties?.shadow_percent.toFixed(2) + '%'}
              </p>
            )}
            {feature.properties?.pixel_resolution !== undefined && (
              <p className="text">
                <span>Pixel Resolution: </span>
                {feature.properties?.pixel_resolution}
              </p>
            )}
          </div>
          <TPDIThumbnail collectionId="PLANET_SCOPE" productId={feature.id} geometry={feature.geometry} />
        </div>
      ) : null}
      <hr />
    </div>
  );
};

export default PlanetFeatureInfo;
