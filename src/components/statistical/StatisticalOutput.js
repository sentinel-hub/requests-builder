import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import statisticalSlice from '../../store/statistical';
import OutputDimensions from '../common/Output/OutputDimensions';

const StatisticalOutput = ({ aggregationInterval }) => {
  const handleAggregationIntervalChange = (e) => {
    store.dispatch(statisticalSlice.actions.setAggregationInterval(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-top-small">Aggregation</h2>
      <div className="form">
        <label className="form__label" htmlFor="aggregations">
          Interval
        </label>
        <input
          className="form__input u-margin-bottom-small"
          type="text"
          id="aggregations"
          placeholder="e.g: P30D"
          value={aggregationInterval}
          onChange={handleAggregationIntervalChange}
        />

        <label className="form__label">Dimensions</label>
        <OutputDimensions useAutoResMode={false} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  aggregationInterval: state.statistical.aggregationInterval,
});

export default connect(mapStateToProps)(StatisticalOutput);
