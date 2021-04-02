import React, { useState, useCallback } from 'react';
import HistogramChart, { margin } from './HistogramChart';
import BandStatistics from './BandStatistics';

const BandResults = ({ band, bandName, containerRef }) => {
  const [tooltipPos, setTooltipPos] = useState([10, 10]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');

  const handleMouseEnter = useCallback(
    (content) => (e) => {
      if (typeof content === 'string') {
        setTooltipContent(content);
      } else {
        setTooltipContent(content(e));
      }
      setIsTooltipVisible(true);
      var rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const y = e.clientY - rect.top; //y position within the element.
      setTooltipPos([y + margin.top, x + 30]);
    },
    [containerRef],
  );

  const handleMouseMove = useCallback(
    (e) => {
      var rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; //x position within the element.
      const y = e.clientY - rect.top; //y position within the element.
      setTooltipPos([y + margin.top, x + 30]);
    },
    [containerRef],
  );

  const handleMouseLeave = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  return (
    <div style={{ paddingLeft: '1rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', marginTop: '1rem', paddingLeft: '1rem' }}>
        {band.histogram && (
          <HistogramChart
            histogram={band.histogram.bins}
            percentiles={band.stats?.percentiles}
            onEnter={handleMouseEnter}
            onLeave={handleMouseLeave}
            onMove={handleMouseMove}
            bandName={bandName}
          />
        )}
        {band.stats && <BandStatistics stats={band.stats} />}
      </div>

      <div
        style={{
          position: 'absolute',
          top: tooltipPos[0] + 'px',
          left: tooltipPos[1] + 'px',
          zIndex: '10',
          visibility: !isTooltipVisible ? 'hidden' : 'visible',
          fontSize: '1.5rem',
          background: 'white',
          border: '1px solid black',
          padding: '0.25rem 0.5rem',
          // pointer events none to make tooltip immune to target events
          pointerEvents: 'none',
        }}
      >
        {tooltipContent}
      </div>
    </div>
  );
};

export default BandResults;
