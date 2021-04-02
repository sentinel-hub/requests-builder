import React, { useState } from 'react';
import DisplayableProperties from '../common/DisplayableProperties';
import TpdiSearchResultHeader from './TpdiSearchResultHeader';

const MaxarFeatureInfo = ({ feature, isDisabled }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);
  return (
    <div className="tpdi-feature">
      <TpdiSearchResultHeader
        date={feature.acquisitionDateStart}
        id={feature.catalogID}
        isDisabled={isDisabled}
        featureGeometry={feature.geometry}
        setExpandedInfo={setExpandedInfo}
        expandedInfo={expandedInfo}
      />
      {expandedInfo && (
        <div style={{ paddingLeft: '2rem' }}>
          <DisplayableProperties
            properties={feature}
            skippedProperties={['geometry', 'catalogID']}
            propertyStyle={{ margin: '0.5rem 0' }}
          />
        </div>
      )}
    </div>
  );
};

export default MaxarFeatureInfo;
