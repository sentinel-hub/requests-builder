import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeEurope, faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import store, { tpdiSlice } from '../../store';
import { formatPercentage } from '../../utils/stringUtils';
import { focusMap, getAreaCoverPercentage } from '../common/Map/utils/crsTransform';
import { getFormattedDatetime } from './utils';
import TPDIThumbnail from './TPDIThumbnail';

const airbusConstellationToProvider = {
  PHR: 'AIRBUS_PLEIADES',
  SPOT: 'AIRBUS_SPOT',
};

const AirbusFeatureInfo = ({ feature, geometry, isDisabled }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);

  const handleParseGeometryToMap = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(feature.geometry));
    focusMap();
  };

  const handleAddToOrder = () => {
    store.dispatch(tpdiSlice.actions.addProduct({ id: feature.properties.id, geometry: feature.geometry }));
    store.dispatch(tpdiSlice.actions.setIsUsingQuery(false));
  };

  const handleSetExpandedInfo = () => {
    setExpandedInfo(!expandedInfo);
  };
  return (
    <div className="tpdi-feature">
      <div className="tpdi-feature-title">
        <div
          onClick={handleSetExpandedInfo}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: '2rem',
            cursor: 'pointer',
            width: '55%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="text">
              <span>{getFormattedDatetime(feature.properties.acquisitionDate)}</span>
            </p>
            <p className="text">
              <span>ID: </span>
              {feature.properties.id}
            </p>
          </div>
          {expandedInfo ? (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleUp} />
          ) : (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} />
          )}
        </div>
        <div className="u-flex-aligned" style={{ justifyContent: 'space-between', width: '30%' }}>
          <button
            className={`secondary-button ${isDisabled ? 'secondary-button--disabled' : ''}`}
            onClick={handleAddToOrder}
            disabled={isDisabled}
          >
            {isDisabled ? 'Added to orders' : 'Add to order'}
          </button>
          <button className="secondary-button" onClick={handleParseGeometryToMap}>
            <FontAwesomeIcon icon={faGlobeEurope} />
          </button>
        </div>
      </div>
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
