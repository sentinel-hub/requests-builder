import React, { useState, useEffect } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import store, { requestSlice } from '../../../store';
import Axios from 'axios';
import { fetchAvailableDatesWithCatalog } from '../../catalog/requests';
import { S1GRD, S2L2A, S2L1C } from '../../../utils/const';

const highlightedStyle = `.DayPicker-Day--highlighted {
  background-color: #b2c22d;
  color: white;
}
`;

// given an array of timeFrom and TimeTo get the first day of the month of earliest day and the last day of the month on the latest.
const getMinMaxDates = (timeFrom, timeTo) => ({
  from: moment(timeFrom).startOf('month').format(),
  to: moment(timeTo).endOf('month').format(),
});

const utcDateToYYYYMMDDFormat = (utcDate) => utcDate.split('T')[0];

const shouldFetchDates = (datasource, mode) =>
  (datasource === S1GRD || datasource === S2L2A || datasource === S2L1C) &&
  (mode === 'BATCH' || mode === 'PROCESS');

const TimeRange = ({ index, timeTo, timeFrom, isDisabled, datasource, geometry, token, mode }) => {
  const [selectedMonths, setSelectedMonths] = useState(getMinMaxDates(timeFrom, timeTo));
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch available dates for a given datasource, aoi and time period.
  useEffect(() => {
    const source = Axios.CancelToken.source();
    const fetchAndSetAvailableDates = async () => {
      try {
        const timerange = { timeFrom: selectedMonths.from, timeTo: selectedMonths.to };
        const res = await fetchAvailableDatesWithCatalog(datasource, timerange, geometry, token, {
          cancelToken: source.token,
        });
        if (res.data && res.data.features) {
          setAvailableDates(res.data.features.map((feature) => new Date(feature)));
        }
      } catch (err) {
        if (!Axios.isCancel(err)) {
          console.error('Error fetching available dates', err);
        }
      }
    };
    if (token && shouldFetchDates(datasource, mode)) {
      fetchAndSetAvailableDates();
    } else {
      setAvailableDates([]);
    }
    return () => {
      source.cancel();
    };
  }, [datasource, token, geometry, selectedMonths.from, selectedMonths.to, mode]);

  const handleTimeFromChange = (d) => {
    if (d) {
      let date = moment(d).utc().startOf('day').format();
      store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: date, idx: index }));
    }
  };
  const handleTimeToChange = (d) => {
    if (d) {
      let date = moment(d).utc().endOf('day').format();
      store.dispatch(requestSlice.actions.setTimeTo({ timeTo: date, idx: index }));
    }
  };
  const handleFromMonthChange = (month) => {
    const newMomentFrom = moment(month);
    if (newMomentFrom < moment(selectedMonths.from)) {
      setSelectedMonths((prevSelectedMonths) => ({
        ...prevSelectedMonths,
        from: newMomentFrom.utc().format(),
      }));
    }
  };
  const handleToMonthChange = (month) => {
    const momentTo = moment(month);
    if (momentTo > moment(selectedMonths.to) && momentTo < moment().endOf('month')) {
      setSelectedMonths((prevSelectedMonths) => ({
        ...prevSelectedMonths,
        to: momentTo.utc().format(),
      }));
    }
  };

  return (
    <>
      <style>{highlightedStyle}</style>

      <label htmlFor="timefrom" className="form__label">
        Time From
      </label>
      <div className="u-margin-bottom-small">
        <DayPickerInput
          value={utcDateToYYYYMMDDFormat(timeFrom)}
          onDayChange={handleTimeFromChange}
          dayPickerProps={{
            selectedDay: timeFrom,
            modifiers: { highlighted: availableDates },
            showOutsideDays: true,
            onMonthChange: handleFromMonthChange,
            disabledDays: { after: new Date() },
          }}
          inputProps={{ disabled: isDisabled, required: true, className: 'form__input', id: 'timefrom' }}
        />
      </div>

      <label htmlFor="timeto" className="form__label">
        Time To
      </label>
      <DayPickerInput
        value={utcDateToYYYYMMDDFormat(timeTo)}
        dayPickerProps={{
          selectedDay: timeTo,
          disabledDays: { after: new Date(), before: new Date(timeFrom) },
          modifiers: { highlighted: availableDates },
          showOutsideDays: true,
          onMonthChange: handleToMonthChange,
        }}
        onDayChange={handleTimeToChange}
        inputProps={{ disabled: isDisabled, required: true, className: 'form__input', id: 'timeto' }}
      />
    </>
  );
};

export default TimeRange;
