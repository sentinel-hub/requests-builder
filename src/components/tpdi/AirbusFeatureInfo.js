import React, { useState } from 'react';
import { formatPercentage } from '../../utils/stringUtils';
import { getAreaCoverPercentage } from '../common/Map/utils/crsTransform';
import TPDIThumbnail from './TPDIThumbnail';
import TpdiSearchResultHeader from './TpdiSearchResultHeader';

const airbusConstellationToProvider = {
  PHR: 'AIRBUS_PLEIADES',
  SPOT: 'AIRBUS_SPOT',
};

const AirbusFeatureInfo = ({ feature, geometry, isDisabled }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);
  const {
    cloudCover,
    snowCover,
    incidenceAngle,
    constellation,
    resolution,
    processingLevel,
  } = feature.properties;
  return (
    <div className="tpdi-feature">
      <TpdiSearchResultHeader
        date={feature.properties?.acquisitionDate}
        id={feature.properties.id}
        isDisabled={isDisabled}
        featureGeometry={feature.geometry}
        setExpandedInfo={setExpandedInfo}
        expandedInfo={expandedInfo}
      />
      {expandedInfo ? (
        <div className="u-flex-aligned">
          <div className="tpdi-feature-extra-info u-margin-bottom-tiny">
            <p className="text">
              <span>Acquisition Date: </span>
              {feature.properties.acquisitionDate}
            </p>
            <p className="text">
              <span>Product geometry coverage: </span>
              {formatPercentage(getAreaCoverPercentage(geometry, feature.geometry))}
            </p>
            {cloudCover !== undefined && (
              <p className="text">
                <span>Cloud Cover: </span>
                {cloudCover.toFixed(2) + '%'}
              </p>
            )}
            {snowCover !== undefined && (
              <p className="text">
                <span>Snow Cover: </span>
                {snowCover.toFixed(2) + '%'}
              </p>
            )}
            {constellation !== undefined && (
              <p className="text">
                <span>Constellation: </span>
                {constellation}
              </p>
            )}
            {resolution !== undefined && (
              <p className="text">
                <span>Resolution: </span>
                {resolution}
              </p>
            )}
            {incidenceAngle !== undefined && (
              <p className="text">
                <span>Incidence Angle: </span>
                {incidenceAngle.toFixed(3)}
              </p>
            )}
            {processingLevel !== undefined && (
              <p className="text">
                <span>Processing Level: </span>
                {processingLevel}
              </p>
            )}
          </div>
          <TPDIThumbnail
            collectionId={airbusConstellationToProvider[feature.properties.constellation]}
            productId={feature.properties.id}
          />
        </div>
      ) : null}
      <hr />
    </div>
  );
};

export default AirbusFeatureInfo;
