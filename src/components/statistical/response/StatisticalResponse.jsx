import React, { useState } from 'react';
import CalculationResults from './CalculationResults';

const formatInterval = (interval) => interval.from.split('T')[0] + ' to ' + interval.to.split('T')[0];

const getNewCalcuation = (response, intervalIdx, previousSelectedCalcuation) => {
  if (response.data[intervalIdx].error !== undefined) {
    return undefined;
  }
  const calcEntries = Object.entries(response.data[intervalIdx].outputs);
  let newCalculation;
  if (previousSelectedCalcuation !== undefined) {
    newCalculation = calcEntries.find(([key]) => key === previousSelectedCalcuation.name) ?? calcEntries[0];
  } else {
    newCalculation = calcEntries[0];
  }
  return {
    name: newCalculation[0],
    calculation: newCalculation[1],
  };
};

const getNewBand = (newCalculation, previousSelctedBand) => {
  if (newCalculation === undefined) {
    return undefined;
  }
  const bandKeys = Object.keys(newCalculation.calculation.bands);
  if (previousSelctedBand !== undefined) {
    return bandKeys.find((bandKey) => bandKey === previousSelctedBand) ?? bandKeys[0];
  }
  return bandKeys[0];
};

const StatisticalResponse = ({ response, containerRef }) => {
  const [selectedInterval, setSelectedInterval] = useState(0);
  const [selectedCalculation, setSelectedCalculation] = useState(() =>
    getNewCalcuation(response, 0, undefined),
  );
  const [selectedBand, setSelectedBand] = useState(() => {
    if (response.data[0].error !== undefined) {
      return undefined;
    }

    const initialCalc = Object.keys(response.data[0].outputs)[0];
    return Object.keys(response.data[0].outputs[initialCalc].bands)[0];
  });

  const handleIntervalChange = (e) => {
    const newIdx = Number(e.target.value);
    const newCalculation = getNewCalcuation(response, newIdx, selectedCalculation);
    const newBand = getNewBand(newCalculation, selectedBand);
    setSelectedBand(newBand);
    setSelectedCalculation(newCalculation);
    setSelectedInterval(newIdx);
  };

  const handleCalculationClickChange = (calcKey) => () => {
    const newCalculation = { calculation: calculations[calcKey], name: calcKey };
    setSelectedCalculation(newCalculation);
    const newBand = getNewBand(newCalculation, selectedBand);
    setSelectedBand(newBand);
  };

  const intervals = response.data.map((dataObj) => formatInterval(dataObj.interval));
  const calculations = response.data[selectedInterval].outputs;
  return (
    <>
      <h3 className="heading-tertiary mt-2">Interval</h3>
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

      {calculations === undefined ? (
        <p className="text text--warning mt-2">This interval failed to process.</p>
      ) : (
        <>
          <h3 className="heading-tertiary mt-2">Calculation</h3>
          {Object.keys(calculations).map((calculationKey) => (
            <button
              className={`secondary-button ${
                selectedCalculation?.name === calculationKey ? 'secondary-button--disabled' : ''
              }`}
              key={calculationKey}
              onClick={handleCalculationClickChange(calculationKey)}
              disabled={selectedCalculation?.name === calculationKey}
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
      )}
    </>
  );
};

export default StatisticalResponse;
