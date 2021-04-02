import React from 'react';

const DisplayableProperties = ({ properties, propertyStyle = {}, skippedProperties = [] }) => {
  const displayableProperites = Object.entries(properties).filter(([key, value]) => {
    const pptType = typeof value;
    return !skippedProperties.includes(key) && (pptType === 'string' || pptType === 'number');
  });
  return displayableProperites.map(([key, value]) => (
    <p className="text" key={key} style={propertyStyle}>
      <span>{key} :</span> {value}
    </p>
  ));
};

export default DisplayableProperties;
