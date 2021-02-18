import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import statisticalSlice from '../../store/statistical';
import OverlayButton from '../common/OverlayButton';
import CalculationHistogram from './CalculationHistogram';
import CalculationStatistics from './CalculationStatistics';

const StatisticalCalculationsContainer = ({ calculations }) => {
  const [expandedCalculations, setExpandedCalculations] = useState(calculations.map((_) => true));
  const overlayRef = useRef();

  const handleAddCalculation = () => {
    store.dispatch(statisticalSlice.actions.addEmptyCalculation());
    handleExpandNewAndCollapseRest();
  };

  const handleExpandCalculation = (idx) => {
    setExpandedCalculations((prev) =>
      prev
        .slice(0, idx)
        .concat(!prev[idx])
        .concat(prev.slice(idx + 1)),
    );
  };

  const handleDeleteExpanded = (idx) => {
    setExpandedCalculations((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1)));
  };
  const handleExpandNewAndCollapseRest = () => {
    setExpandedCalculations((prev) => [...prev.map((p) => false), true]);
  };

  const defaultCalculationIndex = calculations.findIndex((calc) => calc.outputName === 'default');

  return (
    <>
      <h2 className="heading-secondary" style={{ marginBottom: '1.3rem' }}>
        <div className="u-expand-title">
          Calculations & Histograms
          <OverlayButton elementRef={overlayRef} />
        </div>
      </h2>
      <div className="form" ref={overlayRef}>
        {calculations.map((calculation, idx) => (
          <StatisticalCalculation
            calculation={calculation}
            idx={idx}
            key={idx}
            defaultCalculationIndex={defaultCalculationIndex}
            handleExpandCalculation={handleExpandCalculation}
            handleDeleteExpanded={handleDeleteExpanded}
            isExpanded={expandedCalculations[idx]}
          />
        ))}
        <div className="u-flex-between">
          <button className="secondary-button" onClick={handleAddCalculation}>
            Add Calculation
          </button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  calculations: state.statistical.calculations,
});

export default connect(mapStateToProps)(StatisticalCalculationsContainer);

const StatisticalCalculation = ({
  calculation,
  idx,
  defaultCalculationIndex,
  handleExpandCalculation,
  isExpanded,
  handleDeleteExpanded,
}) => {
  const [isSpecifyingOutput, setIsSpecifyingOutput] = useState(
    idx !== defaultCalculationIndex && calculation.outputName !== 'default',
  );
  const [areHistogramsExpanded, setAreHistogramsExpanded] = useState(true);
  const [areStatisticsExpanded, setAreStatisticsExpanded] = useState(true);

  useEffect(() => {
    setIsSpecifyingOutput(idx !== defaultCalculationIndex && calculation.outputName !== 'default');
  }, [calculation.outputName, idx, defaultCalculationIndex]);
  const handleSelectOutputName = (e) => {
    if (e.target.value === 'specific') {
      setIsSpecifyingOutput(true);
    } else {
      store.dispatch(statisticalSlice.actions.setOutputName({ idx, name: 'default' }));
      setIsSpecifyingOutput(false);
    }
  };

  const handleDeleteCalculation = () => {
    store.dispatch(statisticalSlice.actions.deleteCalculation({ idx }));
    handleDeleteExpanded(idx);
  };

  const handleOutputNameChange = (e) => {
    store.dispatch(statisticalSlice.actions.setOutputName({ idx, name: e.target.value }));
  };

  const handleAddHistogram = () => {
    store.dispatch(statisticalSlice.actions.addEmptyHistogram({ idx }));
  };

  const handleAddStatistics = () => {
    store.dispatch(statisticalSlice.actions.addEmptyStatisticsObject({ idx }));
  };

  const handleExpandHistograms = () => {
    if (calculation.histograms.length > 0) {
      setAreHistogramsExpanded(!areHistogramsExpanded);
    }
  };

  const handleExpandStatistics = () => {
    if (calculation.statistics.length > 0) {
      setAreStatisticsExpanded(!areStatisticsExpanded);
    }
  };

  return (
    <>
      <h3
        className="heading-tertiary"
        style={{ cursor: 'pointer' }}
        onClick={() => handleExpandCalculation(idx)}
      >
        <div className="u-flex-between">
          <span>
            Calculation {idx + 1} - {calculation.outputName}
          </span>
          <FontAwesomeIcon icon={isExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
        </div>
      </h3>
      {isExpanded && (
        <>
          <label className="form__label" htmlFor={`select-output-${idx}`}>
            Apply to
          </label>
          <select
            onChange={handleSelectOutputName}
            value={isSpecifyingOutput ? 'specific' : 'default'}
            className="form__input"
            io={`select-output-${idx}`}
          >
            <option value="default">All outputs</option>
            <option value="specific">Specify output</option>
          </select>
          {isSpecifyingOutput && (
            <input
              type="text"
              className="form__input"
              onChange={handleOutputNameChange}
              placeholder="Specify Output name"
              id={`output-calculation-${idx}`}
              value={calculation.outputName}
            />
          )}

          <h3
            className="heading-tertiary"
            style={{ marginBottom: '1rem', cursor: 'pointer', width: 'fit-content' }}
            onClick={handleExpandHistograms}
          >
            <div className="u-flex-between">
              <span className="u-margin-right-small">Histograms</span>
              <FontAwesomeIcon icon={areHistogramsExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </div>
          </h3>
          {areHistogramsExpanded &&
            calculation.histograms.map((histogram, histIdx) => (
              <CalculationHistogram
                histogram={histogram}
                histIdx={histIdx}
                idx={idx}
                key={`hist-${histIdx}`}
              />
            ))}
          <button
            className="secondary-button secondary-button--fit u-margin-bottom-small"
            onClick={handleAddHistogram}
          >
            Add Histogram
          </button>

          <h3
            className="heading-tertiary"
            style={{ cursor: 'pointer', width: 'fit-content', marginBottom: '1rem' }}
            onClick={handleExpandStatistics}
          >
            <div className="u-flex-between">
              <span className="u-margin-right-small">Statistics</span>
              <FontAwesomeIcon icon={areStatisticsExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
            </div>
          </h3>
          {areStatisticsExpanded &&
            calculation.statistics.map((statistics, statIdx) => (
              <CalculationStatistics
                statistics={statistics}
                statIdx={statIdx}
                idx={idx}
                key={`stats-${statIdx}`}
              />
            ))}
          <button
            className="secondary-button secondary-button--fit u-margin-bottom-small"
            onClick={handleAddStatistics}
          >
            Add Statistics
          </button>

          {idx > 0 && (
            <button
              className="secondary-button secondary-button--cancel u-margin-bottom-small"
              onClick={handleDeleteCalculation}
            >
              Delete Calculation
            </button>
          )}
        </>
      )}
    </>
  );
};
