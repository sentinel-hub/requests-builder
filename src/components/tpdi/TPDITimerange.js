import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { connect } from 'react-redux';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import requestSlice from '../../store/request';
import Toggle from '../common/Toggle';
import { utcDateToYYYYMMDDFormat } from '../common/TimeRange/TimeRange';
import moment from 'moment';

const TPDITimerange = ({ isSingleDate, timeTo, timeFrom }) => {
  const handleSingleDate = () => {
    store.dispatch(tpdiSlice.actions.setIsSingleDate(!isSingleDate));
  };
  const handleTimeFromChange = (d) => {
    if (d) {
      let date = moment(d).utc().startOf('day').format();
      store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: date, idx: 0 }));
    }
  };
  const handleTimeToChange = (d) => {
    if (d) {
      let date = moment(d).utc().endOf('day').format();
      store.dispatch(requestSlice.actions.setTimeTo({ timeTo: date, idx: 0 }));
    }
  };
  return (
    <>
      <h2 className="heading-secondary">Time Range</h2>
      <div className="form" style={{ height: '10%', marginBottom: '1rem' }}>
        <div className="toggle-with-label">
          <label htmlFor="toggle-single-date" className="form__label">
            Single Date
          </label>
          <Toggle id="toggle-single-date" onChange={handleSingleDate} checked={isSingleDate} />
        </div>

        <div className="tpdi-timerange-container">
          <label htmlFor="timefrom" className="form__label">
            {isSingleDate ? 'Date:' : 'From:'}
          </label>
          <DayPickerInput
            value={utcDateToYYYYMMDDFormat(timeFrom)}
            dayPickerProps={{
              selectedDay: timeFrom,
              disabledDays: { after: new Date() },
              showOutsideDays: true,
            }}
            onDayChange={handleTimeFromChange}
            inputProps={{
              required: true,
              className: 'form__input',
              id: 'timefrom',
              style: { width: '100px' },
            }}
          />
          {!isSingleDate && (
            <>
              <label htmlFor="timeto" className="form__label">
                To:
              </label>
              <DayPickerInput
                value={utcDateToYYYYMMDDFormat(timeTo)}
                dayPickerProps={{
                  selectedDay: timeTo,
                  disabledDays: { after: new Date(), before: new Date(timeFrom) },
                  showOutsideDays: true,
                }}
                onDayChange={handleTimeToChange}
                inputProps={{
                  required: true,
                  className: 'form__input',
                  id: 'timeto',
                  style: { width: '100px' },
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isSingleDate: state.tpdi.isSingleDate,
  timeFrom: state.request.timeFrom[0],
  timeTo: state.request.timeTo[0],
});
export default connect(mapStateToProps)(TPDITimerange);
