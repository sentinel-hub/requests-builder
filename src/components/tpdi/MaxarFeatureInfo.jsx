import React, { useState } from 'react';
import { formatPercentage } from '../../utils/stringUtils';
import DisplayableProperties from '../common/DisplayableProperties';
import TpdiSearchResultHeader from './TpdiSearchResultHeader';
import TPDIThumbnail from './TPDIThumbnail';

const MaxarFeatureInfo = ({ feature }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);
  return (
    <div className="tpdi-feature">
      <TpdiSearchResultHeader
        date={feature.acquisitionDateStart}
        id={feature.catalogID}
        featureGeometry={feature.geometry}
        setExpandedInfo={setExpandedInfo}
        expandedInfo={expandedInfo}
      />
      {expandedInfo && (
        <div className="flex items-center" style={{ paddingLeft: '2rem' }}>
          <div>
            <p className="text" style={{ margin: '0.5rem 0' }}>
              <span>Product geometry coverage: </span>
              {formatPercentage(feature.areaCoverage)}
            </p>
            <DisplayableProperties
              properties={feature}
              skippedProperties={['geometry', 'catalogID']}
              propertyStyle={{ margin: '0.5rem 0' }}
            />
          </div>
          <TPDIThumbnail
            collectionId="MAXAR_WORLDVIEW"
            productId={feature.catalogID}
            geometry={feature.geometry}
          />
        </div>
      )}
    </div>
  );
};

export default MaxarFeatureInfo;
