import React from 'react';
import { connect } from 'react-redux';
import store, { catalogSlice, requestSlice } from '../../store';
import Toggle from '../common/Toggle';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';

const convertUtcDateToInput = (utcDate) => {
  if (utcDate) {
    return utcDate.split('T')[0];
  }
  return '';
};

const CatalogTimeRange = ({ isTimeToOpen, timeTo, isTimeFromOpen, timeFrom }) => {
  const handleChangeTimeFrom = (d) => {
    const date = moment(d).utc().startOf('day').format();
    store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: date, idx: 0 }));
  };
  const handleChangeTimeTo = (d) => {
    const date = moment(d).utc().endOf('day').format();
    store.dispatch(requestSlice.actions.setTimeTo({ timeTo: date, idx: 0 }));
  };
  const handleOpenTimeTo = () => {
    // if one is already open it cannot be opened.
    if (isTimeFromOpen && !isTimeToOpen) {
      return;
    }
    store.dispatch(catalogSlice.actions.openTimeTo(!isTimeToOpen));
  };
  const handleOpenTimeFrom = () => {
    // if one is already open it cannot be opened.
    if (isTimeToOpen && !isTimeFromOpen) {
      return;
    }
    store.dispatch(catalogSlice.actions.openTimeFrom(!isTimeFromOpen));
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
            <Toggle id="catalog-from" checked={isTimeFromOpen} onChange={handleOpenTimeFrom} />
          </div>
          <DayPickerInput
            value={convertUtcDateToInput(timeFrom)}
            inputProps={{
              disabled: isTimeFromOpen,
              required: true,
              className: 'form__input',
            }}
            onDayChange={handleChangeTimeFrom}
          />
          <div className="toggle-with-label u-margin-top-small">
            <label htmlFor="catalog-to" className="form__label">
              To
            </label>
            <Toggle id="catalog-to" checked={isTimeToOpen} onChange={handleOpenTimeTo} />
          </div>
          <DayPickerInput
            value={convertUtcDateToInput(timeTo)}
            inputProps={{
              disabled: isTimeToOpen,
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
  timeTo: state.request.timeTo[0],
  timeFrom: state.request.timeFrom[0],
  isTimeToOpen: state.catalog.isTimeToOpen,
  isTimeFromOpen: state.catalog.isTimeFromOpen,
});

export default connect(mapStateToProps)(CatalogTimeRange);
