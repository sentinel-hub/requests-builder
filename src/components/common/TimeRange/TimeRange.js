import React, { useState, useRef, useEffect } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import store from '../../../store';
import requestSlice from '../../../store/request';
import Axios from 'axios';
import { S1GRD, S2L2A, S2L1C, L8L1C, S3OLCI, S3SLSTR, S5PL2 } from '../../../utils/const';
import { getFetchDatesBody } from '../../../api/catalog/utils';
import CatalogResource from '../../../api/catalog/CatalogResource';

const highlightedStyle = `.DayPicker-Day--highlighted {
  background-color: #b2c22d;
  color: white;
}
`;

export const utcDateToYYYYMMDDFormat = (utcDate) => utcDate.split('T')[0];

const shouldFetchDates = (datasource, mode) =>
  [S1GRD, S2L2A, S2L1C, L8L1C, S3OLCI, S3SLSTR, S5PL2].includes(datasource) &&
  (mode === 'BATCH' || mode === 'PROCESS');

const getStartOfMonth = (dateString) => {
  return moment(dateString).utc().startOf('month').format();
};

const validStringDate = (s) => /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/gm.test(s);

const TimeRange = ({ index, timeTo, timeFrom, isDisabled, datasource, geometry, token, mode }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [fetchedMonths, setFetchedMonths] = useState([]);
  const sourceRef = useRef(Axios.CancelToken.source());
  const shouldFetchCatalog = token && shouldFetchDates(datasource, mode);
  const [isValidTimeFrom, setIsValidTimeFrom] = useState(true);
  const [isValidTimeTo, setIsValidTimeTo] = useState(true);

  const fetchMonths = async (months) => {
    const fetchHelper = async () => {
      const promises = months.map((month) => {
        const timeRange = { timeFrom: month, timeTo: moment.utc(month).endOf('month').format() };
        const body = getFetchDatesBody(datasource, timeRange, geometry);
        return CatalogResource.fetchDates(datasource)(body, {
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

  const fetchAndSetMonths = async (months) => {
    const newMonths = await fetchMonths(months);
    setAvailableDates((prev) => {
      return [...prev, ...newMonths];
    });
    setFetchedMonths((prev) => {
      return [...prev, ...months];
    });
  };

  const handleTimeFromChange = async (d, _, inputComponent) => {
    const stringInputState = inputComponent?.state?.value;
    if (d && validStringDate(stringInputState)) {
      const startOfMonth = moment(d).utc().startOf('month').format();
      const date = moment(d).utc().startOf('day').format();
      if (shouldFetchCatalog && !fetchedMonths.includes(startOfMonth)) {
        fetchAndSetMonths([startOfMonth]);
      }
      store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: date, idx: index }));
      if (!isValidTimeFrom) {
        setIsValidTimeFrom(true);
      }
    } else {
      setIsValidTimeFrom(false);
    }
  };

  const handleTimeToChange = async (d, _, inputComponent) => {
    const stringInputState = inputComponent?.state?.value;
    if (d && validStringDate(stringInputState)) {
      const startOfMonth = moment(d).utc().startOf('month').format();
      const date = moment(d).utc().endOf('day').format();
      if (shouldFetchCatalog && !fetchedMonths.includes(startOfMonth)) {
        fetchAndSetMonths([startOfMonth]);
      }
      store.dispatch(requestSlice.actions.setTimeTo({ timeTo: date, idx: index }));
      if (!isValidTimeTo) {
        setIsValidTimeTo(true);
      }
    } else {
      setIsValidTimeTo(false);
    }
  };

  const handleMonthChange = async (month) => {
    const newMonth = moment(month).utc().startOf('day').format();
    if (shouldFetchCatalog && !fetchedMonths.includes(newMonth)) {
      fetchAndSetMonths([newMonth]);
    }
  };

  const handleFormatDate = (date) => {
    const d = moment(date).utc().startOf('day').format();
    return d.split('T')[0];
  };

  const handleDayPickerOpen = (isFrom) => () => {
    if (!shouldFetchCatalog) {
      setFetchedMonths([]);
      setAvailableDates([]);
      return;
    }
    const month = isFrom ? getStartOfMonth(timeFrom) : getStartOfMonth(timeTo);
    if (!fetchedMonths.includes(month)) {
      fetchAndSetMonths([month]);
    }
  };

  useEffect(() => {
    setAvailableDates([]);
    setFetchedMonths([]);
  }, [datasource]);

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
        formatDate={handleFormatDate}
        onDayPickerShow={handleDayPickerOpen(true)}
        inputProps={{
          disabled: isDisabled,
          required: true,
          className: `form__input ${!isValidTimeFrom ? 'timerange-input--invalid' : ''}`,
          id: 'timefrom',
        }}
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
        formatDate={handleFormatDate}
        onDayChange={handleTimeToChange}
        inputProps={{
          disabled: isDisabled,
          required: true,
          className: `form__input ${!isValidTimeTo ? 'timerange-input--invalid' : ''}`,
          id: 'timeto',
        }}
      />
    </>
  );
};

export default TimeRange;
