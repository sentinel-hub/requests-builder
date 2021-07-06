import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import requestSlice from '../../store/request';
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
    store.dispatch(catalogSlice.actions.openTimeTo(!isTimeToOpen));
  };
  const handleOpenTimeFrom = () => {
    store.dispatch(catalogSlice.actions.openTimeFrom(!isTimeFromOpen));
  };

  return (
    <>
      <h2 className="heading-secondary">Time Range</h2>
      <div className="form">
        <div className="flex flex-col h-full w-full mb-1">
          <div className="flex items-center mb-2 w-full">
            <label htmlFor="catalog-from" className="form__label cursor-pointer mr-2">
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
          <div className="flex items-center mb-2 mt-2 w-full">
            <label htmlFor="catalog-to" className="form__label cursor-pointer mr-2">
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
