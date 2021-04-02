import React, { useState, useEffect } from 'react';
import store from '../../store';
import statisticalSlice from '../../store/statistical';
import { inputArrayChangeHandler } from './utils/utils';

const CalculationStatistics = ({ idx, statistics, statIdx }) => {
  const [isSpecifyingBand, setIsSpecifyingBandName] = useState(statistics.statisticsBandName !== 'default');

  useEffect(() => {
    if (statistics.statisticsBandName !== 'default') {
      setIsSpecifyingBandName(true);
    }
  }, [statistics.statisticsBandName]);

  const handleStatisticsBandNameChange = (e) => {
    store.dispatch(
      statisticalSlice.actions.setStatisticsParam({
        param: 'statisticsBandName',
        value: e.target.value,
        idx,
        statIdx,
      }),
    );
  };

  const handlePercentilesArrayChange = (e) => {
    try {
      const dispatchedValue = inputArrayChangeHandler(e);
      if (dispatchedValue !== undefined) {
        store.dispatch(
          statisticalSlice.actions.setStatisticsParam({
            param: 'k',
            value: dispatchedValue,
            idx,
            statIdx,
          }),
        );
      }
    } catch (err) {
      console.error("Can't parse array", err);
    }
  };

  const handleDeleteStatistics = () => {
    store.dispatch(statisticalSlice.actions.deleteStatistics({ idx, statIdx }));
  };

  const handleSelectBandName = (e) => {
    if (e.target.value === 'specific') {
      setIsSpecifyingBandName(true);
    } else {
      store.dispatch(
        statisticalSlice.actions.setStatisticsParam({
          param: 'statisticsBandName',
          idx,
          statIdx,
          value: 'default',
        }),
      );
      setIsSpecifyingBandName(false);
    }
  };

  return (
    <div style={{ padding: '0 0 0.5rem 1rem' }}>
      <label className="form__label">Apply to</label>
      <select
        value={isSpecifyingBand ? 'specific' : 'default'}
        onChange={handleSelectBandName}
        className="form__input"
      >
        <option value="default">All bands</option>
        <option value="specific">Specific band</option>
      </select>
      {isSpecifyingBand && (
        <input
          value={statistics.statisticsBandName}
          className="form__input"
          type="text"
          placeholder="Specify band name"
          name="histogramBandName"
          onChange={handleStatisticsBandNameChange}
        />
      )}

      <label className="form__label">Percentiles Array</label>
      <input
        type="text"
        onChange={handlePercentilesArrayChange}
        className="form__input"
        placeholder="e.g: 50,90,95,99,100"
        value={statistics.k.toString()}
      />

      <label className="form__label">Interpolation</label>
      <input
        className="form__input"
        type="text"
        readOnly
        placeholder="e.g: higher"
        value={statistics.interpolation}
      />

      <button
        className="secondary-button secondary-button--cancel secondary-button--fit"
        onClick={handleDeleteStatistics}
      >
        Delete Statistics
      </button>

      <hr style={{ margin: '1rem 0' }} />
    </div>
  );
};

export default CalculationStatistics;
