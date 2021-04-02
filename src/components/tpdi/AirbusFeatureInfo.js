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
            <p className="text">
              <span>Cloud Cover: </span>
              {feature.properties.cloudCover.toFixed(2) + '%'}
            </p>
            <p className="text">
              <span>Snow Cover: </span>
              {feature.properties.snowCover.toFixed(2) + '%'}
            </p>
            <p className="text">
              <span>Constellation: </span>
              {feature.properties.constellation}
            </p>
            <p className="text">
              <span>Resolution: </span>
              {feature.properties.resolution}
            </p>
            <p className="text">
              <span>Incidence Angle: </span>
              {feature.properties.incidenceAngle.toFixed(3)}
            </p>
            <p className="text">
              <span>Processing Level: </span>
              {feature.properties.processingLevel}
            </p>
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
