import React from 'react';
import BandResults from './BandResults';

const CalculationResults = ({ calculation, selectedBand, containerRef, setSelectedBand }) => {
  const handleBandChangeClick = (bandKey) => () => {
    setSelectedBand(bandKey);
  };
  return (
    <div>
      <h3 className="heading-tertiary mt-2">Band</h3>
      {Object.keys(calculation.bands).map((bandKey) => (
        <button
          className={`secondary-button ${bandKey === selectedBand ? 'secondary-button--disabled' : ''}`}
          disabled={bandKey === selectedBand}
          onClick={handleBandChangeClick(bandKey)}
          key={bandKey}
          style={{ marginRight: '1.5rem', marginBottom: '1rem' }}
        >
          {bandKey}
        </button>
      ))}

      <BandResults
        band={calculation.bands[selectedBand]}
        containerRef={containerRef}
        bandName={selectedBand}
      />
    </div>
  );
};

export default CalculationResults;
