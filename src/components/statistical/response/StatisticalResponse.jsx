import React, { useState } from 'react';
import CalculationResults from './CalculationResults';

const formatInterval = (interval) => interval.from.split('T')[0] + ' to ' + interval.to.split('T')[0];

const StatisticalResponse = ({ response, containerRef }) => {
  const [selectedInterval, setSelectedInterval] = useState(0);
  const [selectedCalculation, setSelectedCalculation] = useState(() => {
    const selectedEntry = Object.entries(response.data[0].outputs)[0];
    return {
      name: selectedEntry[0],
      calculation: selectedEntry[1],
    };
  });
  const [selectedBand, setSelectedBand] = useState(() => {
    const initialCalc = Object.keys(response.data[0].outputs)[0];
    return Object.keys(response.data[0].outputs[initialCalc].bands)[0];
  });

  const intervals = response.data.map((dataObj) => formatInterval(dataObj.interval));
  const calculations = response.data[selectedInterval].outputs;

  const handleIntervalChange = (e) => {
    const newIdx = Number(e.target.value);
    setSelectedInterval(newIdx);
    const calcEntries = Object.entries(response.data[newIdx].outputs);
    const newCalculation = calcEntries.find(([key]) => key === selectedCalculation.name) ?? calcEntries[0];
    setSelectedCalculation({
      name: newCalculation[0],
      calculation: newCalculation[1],
    });
    const bandKeys = Object.keys(newCalculation[1].bands);
    const newBand = bandKeys.find((bandKey) => bandKey === selectedBand) ?? bandKeys[0];
    setSelectedBand(newBand);
  };

  const handleCalculationClickChange = (calcKey) => () => {
    const newCalculation = calculations[calcKey];
    setSelectedCalculation({ calculation: newCalculation, name: calcKey });
    const bandKeys = Object.keys(newCalculation.bands);
    const newBand = bandKeys.find((bandKey) => bandKey === selectedBand) ?? bandKeys[0];
    setSelectedBand(newBand);
  };

  return (
    <>
      <h3 className="heading-tertiary u-margin-top-small">Interval</h3>
      <select
        className="form__input form__input--fit"
        onChange={handleIntervalChange}
        value={selectedInterval}
      >
        {intervals.map((formattedInterval, idx) => (
          <option key={formattedInterval} value={idx}>
            {formattedInterval}
          </option>
        ))}
      </select>

      <h3 className="heading-tertiary u-margin-top-small">Calculation</h3>
      {Object.keys(calculations).map((calculationKey) => (
        <button
          className={`secondary-button ${
            selectedCalculation.name === calculationKey ? 'secondary-button--disabled' : ''
          }`}
          key={calculationKey}
          onClick={handleCalculationClickChange(calculationKey)}
          disabled={selectedCalculation.name === calculationKey}
          style={{ marginRight: '1.5rem' }}
        >
          {calculationKey}
        </button>
      ))}

      <CalculationResults
        calculationName={selectedCalculation.name}
        calculation={selectedCalculation.calculation}
        containerRef={containerRef}
        selectedBand={selectedBand}
        setSelectedBand={setSelectedBand}
      />
    </>
  );
};

export default StatisticalResponse;
