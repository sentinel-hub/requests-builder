import React from 'react';
import moment from 'moment';
import store, { requestSlice } from '../../store';
import { connect } from 'react-redux';
import { DATAFUSION } from '../../utils/const';
import Toggle from '../Toggle';

export const convertUtcDateToInput = (utcDate) => {
  if (utcDate) {
    return utcDate.split('T')[0];
  }
  return '';
};

export const returnValidatedTimeFrom = (stringDate) => {
  let d = moment.utc(stringDate);
  let today = moment().utc().startOf('day');
  if (today - d < 0) {
    d = today;
  }
  return d;
};

export const returnValidatedTimeTo = (stringDate) => {
  let d = moment.utc(stringDate).endOf('day');
  let today = moment().utc().endOf('day');
  if (today - d < 0) {
    d = today;
  }
  return d;
};

const multipleTimeRangeIsValid = (mode, datasource) => {
  return (mode === 'PROCESS' || mode === 'BATCH') && datasource === DATAFUSION;
};

const TimeRangeSelect = ({ timeFromArray, timeToArray, datasource, isDisabled, mode, datafusionSources }) => {
  const generateTimeRanges = () => {
    let timerangeLength = multipleTimeRangeIsValid(mode, datasource)
      ? Math.min(timeFromArray.length, timeToArray.length)
      : 1;
    let jsxResult = [];
    for (let i = 0; i < timerangeLength; i++) {
      jsxResult.push(
        <div className="timerange" key={i}>
          {timerangeLength > 1 ? <label className="form__label">Timerange Datasource {i + 1}</label> : null}
          <label className="form__label">From</label>
          <input
            disabled={isDisabled}
            value={convertUtcDateToInput(timeFromArray[i])}
            required
            className="form__input"
            onChange={handleChangeTimeFrom}
            type="date"
            name={i}
          ></input>
          <label className="form__label">To</label>
          <input
            disabled={isDisabled}
            value={convertUtcDateToInput(timeToArray[i])}
            required
            className="form__input"
            onChange={handleChangeTimeTo}
            type="date"
            name={i}
          ></input>
          {i > 0 ? (
            <button
              name={i}
              onClick={handleDeleteTimeRange}
              className="secondary-button secondary-button--cancel"
            >
              Delete Timerange
            </button>
          ) : null}
          {i < timerangeLength - 1 ? <hr className="u-margin-bottom-tiny u-margin-top-tiny"></hr> : null}
        </div>,
      );
    }
    return jsxResult;
  };

  const canAddTimeRange = () => {
    return (
      timeFromArray.length < datafusionSources.length &&
      timeToArray.length < datafusionSources.length &&
      multipleTimeRangeIsValid(mode, datasource)
    );
  };

  const handleChangeTimeFrom = (e) => {
    let d = returnValidatedTimeFrom(e.target.value);
    store.dispatch(
      requestSlice.actions.setTimeFrom({
        idx: e.target.name,
        timeFrom: d.format(),
      }),
    );
  };

  const handleChangeTimeTo = (e) => {
    let d = returnValidatedTimeTo(e.target.value);
    store.dispatch(
      requestSlice.actions.setTimeTo({
        timeTo: d.format(),
        idx: e.target.name,
      }),
    );
  };

  const handleDeleteTimeRange = (e) => {
    store.dispatch(requestSlice.actions.deleteTimerange(e.target.name));
  };

  return (
    <>
      <div className="heading-with-button">
        <h2 className="heading-secondary">Time Range</h2>
      </div>
      <div
        className="form"
        style={{
          overflowY: 'scroll',
          maxHeight: `${multipleTimeRangeIsValid(mode, datasource) ? '224px' : ''}`,
        }}
      >
        <div className="toggle-with-label">
          <label htmlFor="toggle-timerange" className="form__label">
            {isDisabled ? 'Enable timerange' : 'Disable timerange'}
          </label>
          <Toggle
            id="toggle-timerange"
            onChange={() => store.dispatch(requestSlice.actions.disableTimerange(!isDisabled))}
            defaultChecked={true}
          />
        </div>
        {generateTimeRanges()}
        {canAddTimeRange() ? (
          <button
            className="secondary-button"
            onClick={() => store.dispatch(requestSlice.actions.addTimeRange())}
          >
            Add Timerange
          </button>
        ) : null}
        {canAddTimeRange() ? (
          <p className="text u-margin-top-small">
            <i>Note: Datasources that don't have a timerange defined will use the first one</i>
          </p>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  timeToArray: store.request.timeTo,
  timeFromArray: store.request.timeFrom,
  isDisabled: store.request.isTimeRangeDisabled,
  datasource: store.request.datasource,
  mode: store.request.mode,
  datafusionSources: store.request.datafusionSources,
});

export default connect(mapStateToProps)(TimeRangeSelect);
