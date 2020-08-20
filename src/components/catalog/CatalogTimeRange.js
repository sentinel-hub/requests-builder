import React from 'react';
import {
  convertUtcDateToInput,
  returnValidatedTimeTo,
  returnValidatedTimeFrom,
} from '../input/TimeRangeSelect';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import Toggle from '../Toggle';

const CatalogTimeRange = ({ timeFrom, timeTo }) => {
  const handleChangeTimeFrom = (e) => {
    let d = returnValidatedTimeFrom(e.target.value);
    store.dispatch(catalogSlice.actions.setTimeFrom(d.format()));
  };
  const handleChangeTimeTo = (e) => {
    let d = returnValidatedTimeTo(e.target.value);
    store.dispatch(catalogSlice.actions.setTimeTo(d.format()));
  };
  const handleOpenTimeTo = () => {
    // if one is already open it cannot be opened.
    if (timeFrom.isOpen && !timeTo.isOpen) {
      return;
    }
    store.dispatch(catalogSlice.actions.openTimeTo(!timeTo.isOpen));
  };
  const handleOpenTimeFrom = () => {
    // if one is already open it cannot be opened.
    if (timeTo.isOpen && !timeFrom.isOpen) {
      return;
    }
    store.dispatch(catalogSlice.actions.openTimeFrom(!timeFrom.isOpen));
  };

  return (
    <>
      <h2 className="heading-secondary">Time Range</h2>
      <div className="form">
        <div className="timerange">
          <div className="toggle-with-label">
            <label className="form__label">From</label>
            <Toggle checked={timeFrom.isOpen} onChange={handleOpenTimeFrom} />
          </div>
          <input
            disabled={timeFrom.isOpen}
            value={convertUtcDateToInput(timeFrom.time)}
            required
            className="form__input"
            onChange={handleChangeTimeFrom}
            type="date"
          ></input>
          <div className="toggle-with-label">
            <label className="form__label">To</label>
            <Toggle checked={timeTo.isOpen} onChange={handleOpenTimeTo} />
          </div>
          <input
            disabled={timeTo.isOpen}
            value={convertUtcDateToInput(timeTo.time)}
            required
            className="form__input"
            onChange={handleChangeTimeTo}
            type="date"
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  timeFrom: state.catalog.timeFrom,
  timeTo: state.catalog.timeTo,
});

export default connect(mapStateToProps)(CatalogTimeRange);
