import React from 'react';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import Toggle from '../common/Toggle';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';

const convertUtcDateToInput = (utcDate) => {
  if (utcDate) {
    return utcDate.split('T')[0];
  }
  return '';
};

const CatalogTimeRange = ({ timeFrom, timeTo }) => {
  const handleChangeTimeFrom = (d) => {
    const date = moment(d).utc().startOf('day').format();
    store.dispatch(catalogSlice.actions.setTimeFrom(date));
  };
  const handleChangeTimeTo = (d) => {
    const date = moment(d).utc().endOf('day').format();
    store.dispatch(catalogSlice.actions.setTimeTo(date));
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
            <label htmlFor="catalog-from" className="form__label">
              From
            </label>
            <Toggle id="catalog-from" checked={timeFrom.isOpen} onChange={handleOpenTimeFrom} />
          </div>
          <DayPickerInput
            value={convertUtcDateToInput(timeFrom.time)}
            inputProps={{
              disabled: timeFrom.isOpen,
              required: true,
              className: 'form__input',
            }}
            onDayChange={handleChangeTimeFrom}
          />
          <div className="toggle-with-label u-margin-top-small">
            <label htmlFor="catalog-to" className="form__label">
              To
            </label>
            <Toggle id="catalog-to" checked={timeTo.isOpen} onChange={handleOpenTimeTo} />
          </div>
          <DayPickerInput
            value={convertUtcDateToInput(timeTo.time)}
            inputProps={{
              disabled: timeTo.isOpen,
              required: true,
              className: 'form__input',
            }}
            onDayChange={handleChangeTimeTo}
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
