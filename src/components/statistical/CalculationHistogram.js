import React, { useState, useEffect } from 'react';
import store from '../../store';
import statisticalSlice from '../../store/statistical';

const CalculationHistogram = ({ histogram, histIdx, idx }) => {
  const [isSpecifyingBand, setIsSpecifyingBandName] = useState(histogram.histogramBandName !== 'default');
  const { histogramBinsMethod } = histogram;

  useEffect(() => {
    if (histogram.histogramBandName !== 'default') {
      setIsSpecifyingBandName(true);
    }
  }, [histogram.histogramBandName]);

  const handleSelectBandName = (e) => {
    if (e.target.value === 'specific') {
      setIsSpecifyingBandName(true);
    } else {
      store.dispatch(
        statisticalSlice.actions.setHistogramParam({
          param: 'histogramBandName',
          idx,
          histIdx,
          value: 'default',
        }),
      );
      setIsSpecifyingBandName(false);
    }
  };

  const handleHistogramTextParamChange = (e) => {
    store.dispatch(
      statisticalSlice.actions.setHistogramParam({
        param: e.target.name,
        value: e.target.value,
        histIdx,
        idx,
      }),
    );
  };
  const handleChangeBinsArray = (e) => {
    try {
      const array = e.target.value.split(',').map((n) => Number(n));
      store.dispatch(
        statisticalSlice.actions.setHistogramParam({ param: 'bins', value: array, idx, histIdx }),
      );
    } catch (err) {
      console.error("Can't parse array");
    }
  };

  const handleHistogramNumberParamChange = (e) => {
    store.dispatch(
      statisticalSlice.actions.setHistogramParam({
        param: e.target.name,
        value: Number(e.target.value),
        idx,
        histIdx,
      }),
    );
  };

  const handleDeleteHistogram = () => {
    store.dispatch(statisticalSlice.actions.deleteHistogram({ histIdx, idx }));
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
        <option value="specific">Specify band</option>
      </select>
      {isSpecifyingBand && (
        <input
          value={histogram.histogramBandName}
          className="form__input"
          type="text"
          placeholder="Specify band name"
          name="histogramBandName"
          onChange={handleHistogramTextParamChange}
        />
      )}

      <label className="form__label">Specify</label>
      <div className="u-flex-between u-margin-bottom-small">
        <button
          className={`secondary-button ${
            histogramBinsMethod === 'NBINS' ? 'secondary-button--disabled' : ''
          }`}
          value="NBINS"
          disabled={histogramBinsMethod === 'NBINS'}
          onClick={handleHistogramTextParamChange}
          name="histogramBinsMethod"
        >
          Number of bins
        </button>
        <button
          className={`secondary-button ${
            histogramBinsMethod === 'BINWIDTH' ? 'secondary-button--disabled' : ''
          }`}
          value="BINWIDTH"
          style={{ margin: '1rem' }}
          onClick={handleHistogramTextParamChange}
          name="histogramBinsMethod"
        >
          Bin width
        </button>
        <button
          value="BINS"
          className={`secondary-button ${histogramBinsMethod === 'BINS' ? 'secondary-button--disabled' : ''}`}
          onClick={handleHistogramTextParamChange}
          name="histogramBinsMethod"
        >
          Bins array
        </button>
      </div>

      {histogramBinsMethod === 'NBINS' && (
        <>
          <label className="form__label">Number of bins</label>
          <input
            className="form__input"
            value={histogram.nBins}
            name="nBins"
            type="number"
            placeholder="Specify number of bins"
            onChange={handleHistogramNumberParamChange}
          />
        </>
      )}
      {histogramBinsMethod === 'BINWIDTH' && (
        <>
          <label className="form__label">Bin Width</label>
          <input
            className="form__input"
            value={histogram.binWidth}
            type="number"
            name="binWidth"
            placeholder="e.g: 3"
            onChange={handleHistogramNumberParamChange}
          />
        </>
      )}
      {(histogramBinsMethod === 'BINWIDTH' || histogramBinsMethod === 'NBINS') && (
        <>
          <label className="form__label">Low Edge (optional)</label>
          <input
            className="form__input"
            value={histogram.lowEdge}
            type="number"
            name="lowEdge"
            placeholder="e.g: 0.2"
            onChange={handleHistogramNumberParamChange}
          />
          <label className="form__label">High Edge (optional)</label>
          <input
            className="form__input"
            value={histogram.highEdge}
            type="number"
            name="highEdge"
            placeholder="e.g: 0.3"
            onChange={handleHistogramNumberParamChange}
          />
        </>
      )}
      {histogramBinsMethod === 'BINS' && (
        <>
          <label className="form__label">Bins array</label>
          <input
            className="form__input"
            value={histogram.bins?.toString()}
            type="text"
            placeholder="e.g: 0,1,2,3,4"
            onChange={handleChangeBinsArray}
          />
        </>
      )}
      <button
        className="secondary-button secondary-button--cancel secondary-button--fit"
        onClick={handleDeleteHistogram}
      >
        Delete Histogram
      </button>
      <hr style={{ margin: '1rem 0' }} />
    </div>
  );
};

export default CalculationHistogram;
