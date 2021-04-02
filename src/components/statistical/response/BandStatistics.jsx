import React from 'react';
import { formatNumber } from '../../../utils/const';

const BandStatistics = React.memo(({ stats }) => {
  return (
    <div>
      <h4 className="heading-4 u-margin-bottom-tiny">Statistics</h4>
      {Object.entries(stats).map(([key, value]) => {
        if (key !== 'percentiles') {
          return (
            <p className="text" key={key}>
              <span>{key}: </span>
              {formatNumber(value, 4)}
            </p>
          );
        } else {
          return (
            <p className="text" key={key}>
              <span>Percentiles: </span>
              {Object.entries(value).map(([perKey, perVal]) => (
                <span style={{ paddingLeft: '1rem', display: 'block' }} key={perKey}>
                  <span>{perKey}: </span>
                  {formatNumber(perVal, 4)}
                </span>
              ))}
            </p>
          );
        }
      })}
    </div>
  );
});

export default BandStatistics;
