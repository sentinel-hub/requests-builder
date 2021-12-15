import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import statisticalSlice from '../../store/statistical';
import OutputDimensions from '../common/Output/OutputDimensions';
import Select from '../common/Select';
import Tooltip from '../common/Tooltip/Tooltip';

const LAST_BEHAVIOR_OPTIONS = [
  { value: '', name: 'Select an option' },
  { value: 'SKIP', name: 'Skip' },
  { value: 'SHORTEN', name: 'Shorten' },
  { value: 'EXTEND', name: 'Extend' },
];

const StatisticalOutput = ({ aggregationInterval, lastIntervalBehavior }) => {
  const handleAggregationIntervalChange = (e) => {
    store.dispatch(statisticalSlice.actions.setAggregationInterval(e.target.value));
  };

  const handleLastIntervalBehaviorChange = (value) => {
    store.dispatch(statisticalSlice.actions.setLastIntervalBehavior(value));
  };

  return (
    <>
      <h2 className="heading-secondary mt-2">Aggregation</h2>
      <div className="form">
        <label className="form__label" htmlFor="aggregations">
          Interval
        </label>
        <input
          className="form__input mb-2"
          type="text"
          id="aggregations"
          placeholder="e.g: P30D"
          value={aggregationInterval}
          onChange={handleAggregationIntervalChange}
        />

        <label className="form__label flex items-center" htmlFor="lastIntervalBehavior">
          Last Interval Behavior (optional)
          <Tooltip
            direction="right"
            content={
              <>
                This parameter specifies the behavior of the last interval if the given time range isn't
                divisible by the provided aggregation interval.
                <br className="mb-2" />
                <ul>
                  <li>SKIP - skip the last interval (default behavior)</li>
                  <li>
                    SHORTEN - shortens the last interval so that it ends at the end of provided time range.
                  </li>
                  <li>
                    EXTEND - extends the last interval over the end of the provided time range so that all
                    intervals are of equal duration
                  </li>
                </ul>
              </>
            }
            infoStyles={{ marginLeft: '0.5rem' }}
          />
        </label>
        <Select
          options={LAST_BEHAVIOR_OPTIONS}
          selected={lastIntervalBehavior}
          buttonClassNames="mb-2"
          onChange={handleLastIntervalBehaviorChange}
        />

        <label className="form__label">Dimensions</label>
        <OutputDimensions useAutoResMode={false} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  aggregationInterval: state.statistical.aggregationInterval,
  lastIntervalBehavior: state.statistical.lastIntervalBehavior,
});

export default connect(mapStateToProps)(StatisticalOutput);
