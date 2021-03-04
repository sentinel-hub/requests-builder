import React, { useState, useRef } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import store from '../../../store';
import requestSlice from '../../../store/request';
import Axios from 'axios';
import { fetchAvailableDatesWithCatalog } from '../../catalog/requests';
import { S1GRD, S2L2A, S2L1C } from '../../../utils/const';

const highlightedStyle = `.DayPicker-Day--highlighted {
  background-color: #b2c22d;
  color: white;
}
`;

export const utcDateToYYYYMMDDFormat = (utcDate) => utcDate.split('T')[0];

const shouldFetchDates = (datasource, mode) =>
  (datasource === S1GRD || datasource === S2L2A || datasource === S2L1C) &&
  (mode === 'BATCH' || mode === 'PROCESS');

const getStartOfMonth = (dateString) => {
  return moment(dateString).utc().startOf('month').format();
};

const TimeRange = ({ index, timeTo, timeFrom, isDisabled, datasource, geometry, token, mode }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [fetchedMonths, setFetchedMonths] = useState([]);
  const sourceRef = useRef(Axios.CancelToken.source());
  const shouldFetchCatalog = token && shouldFetchDates(datasource, mode);

  const fetchMonths = async (months) => {
    const fetchHelper = async () => {
      const promises = months.map((month) => {
        const timeRange = { timeFrom: month, timeTo: moment.utc(month).endOf('month').format() };
        return fetchAvailableDatesWithCatalog(datasource, timeRange, geometry, token, {
          cancelToken: sourceRef.current.token,
        });
      });
      const res = await Promise.all(promises);
      const newDates = res.reduce((acc, currentResponse) => {
        return [...acc, ...currentResponse.data.features];
      }, []);
      return newDates;
    };
    const newDates = await fetchHelper();
    return newDates.map((d) => new Date(d));
  };

  const fetchAndSetMonths = async (months, override = false) => {
    const newMonths = await fetchMonths(months);
    setAvailableDates((prev) => {
      if (override) {
        return newMonths;
      } else {
        return [...prev, ...newMonths];
      }
    });
    setFetchedMonths((prev) => {
      if (override) {
        return months;
      } else {
        return [...prev, ...months];
      }
    });
  };

  const handleTimeFromChange = async (d) => {
    if (d) {
      const startOfMonth = moment(d).utc().startOf('month').format();
      const date = moment(d).utc().startOf('day').format();
      if (shouldFetchCatalog && !fetchedMonths.includes(startOfMonth)) {
        fetchAndSetMonths([startOfMonth]);
      }
      store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: date, idx: index }));
    }
  };

  const handleTimeToChange = async (d) => {
    if (d) {
      const startOfMonth = moment(d).utc().startOf('month').format();
      const date = moment(d).utc().endOf('day').format();
      if (shouldFetchCatalog && !fetchedMonths.includes(startOfMonth)) {
        fetchAndSetMonths([startOfMonth]);
      }
      store.dispatch(requestSlice.actions.setTimeTo({ timeTo: date, idx: index }));
    }
  };

  const handleMonthChange = async (month) => {
    const newMonth = moment(month).utc().startOf('day').format();
    if (shouldFetchCatalog && !fetchedMonths.includes(newMonth)) {
      fetchAndSetMonths([newMonth]);
    }
  };

  const handleDayPickerOpen = (isFrom) => () => {
    if (!shouldFetchCatalog) {
      setFetchedMonths([]);
      setAvailableDates([]);
      return;
    }
    const month = isFrom ? getStartOfMonth(timeFrom) : getStartOfMonth(timeTo);
    if (!fetchedMonths.includes(month)) {
      fetchAndSetMonths([month], true);
    }
  };

  return (
    <>
      <style>{highlightedStyle}</style>

      <label htmlFor="timefrom" className="form__label">
        Time From
      </label>
      <DayPickerInput
        value={utcDateToYYYYMMDDFormat(timeFrom)}
        onDayChange={handleTimeFromChange}
        dayPickerProps={{
          selectedDay: timeFrom,
          modifiers: { highlighted: availableDates },
          showOutsideDays: true,
          onMonthChange: handleMonthChange,
          disabledDays: { after: new Date() },
        }}
        onDayPickerShow={handleDayPickerOpen(true)}
        inputProps={{ disabled: isDisabled, required: true, className: 'form__input', id: 'timefrom' }}
      />

      <label htmlFor="timeto" className="form__label u-margin-top-small">
        Time To
      </label>
      <DayPickerInput
        value={utcDateToYYYYMMDDFormat(timeTo)}
        dayPickerProps={{
          selectedDay: timeTo,
          disabledDays: { after: new Date(), before: new Date(timeFrom) },
          modifiers: { highlighted: availableDates },
          showOutsideDays: true,
          onMonthChange: handleMonthChange,
        }}
        onDayPickerShow={handleDayPickerOpen(false)}
        onDayChange={handleTimeToChange}
        inputProps={{ disabled: isDisabled, required: true, className: 'form__input', id: 'timeto' }}
      />
    </>
  );
};

export default TimeRange;
