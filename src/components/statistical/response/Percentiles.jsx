import React from 'react';

const Percentiles = ({ onEnter, onLeave, onMove, points, path }) => {
  if (!points) {
    return null;
  }
  return (
    <>
      {points.map((point) => (
        <PointWithTooltip
          percentileKey={point.percentileKey}
          percentileValue={point.percentileValue}
          cx={point.cx}
          cy={point.cy}
          key={point.cx}
          onEnter={onEnter}
          onLeave={onLeave}
          onMove={onMove}
        />
      ))}
      <path d={path} fill="none" stroke="blue" />
    </>
  );
};

const PointWithTooltip = ({ cx, cy, onEnter, onLeave, onMove, percentileKey, percentileValue }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="5"
      fill="black"
      onMouseOver={onEnter(`Percentile ${percentileKey}: ${formatNumber(percentileValue, 2)}`)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    />
  );
};

export default Percentiles;
