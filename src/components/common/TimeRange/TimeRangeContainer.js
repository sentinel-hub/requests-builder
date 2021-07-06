import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import TimeRange from './TimeRange';
import store from '../../../store';
import requestSlice from '../../../store/request';
import Toggle from '../Toggle';
import { DEM } from '../../../utils/const/const';

const multipleTimeRangeIsValid = (mode, isOnDatafusion) => {
  return (mode === 'PROCESS' || mode === 'BATCH') && isOnDatafusion;
};

const supportsTimeRange = (datasource) => !(datasource === DEM);

const TimeRangeContainer = ({
  timeToArray,
  timeFromArray,
  isDisabled,
  mode,
  dataCollections,
  geometry,
  token,
}) => {
  const isOnDatafusion = useMemo(() => {
    return dataCollections.length > 1;
  }, [dataCollections.length]);

  const firstDataCollectionType = useMemo(() => {
    return dataCollections[0].type;
  }, [dataCollections]);

  useEffect(() => {
    if (!supportsTimeRange(firstDataCollectionType)) {
      store.dispatch(requestSlice.actions.disableTimerange(true));
    }
  }, [firstDataCollectionType]);

  const handleDisableTimerange = () => {
    if (supportsTimeRange(firstDataCollectionType)) {
      store.dispatch(requestSlice.actions.disableTimerange(!isDisabled));
    }
  };

  const generateTimeRangesJSX = (canHaveMultipleTimeRanges) => {
    const timerangeLength = timeToArray.length;
    let usedTimeToArray = timeToArray;
    if (!canHaveMultipleTimeRanges) {
      usedTimeToArray = usedTimeToArray.slice(0, 1);
    }
    return usedTimeToArray.map((timeTo, i) => {
      // If datafusion select the proper datasource.
      const selectedDatasource = dataCollections[i].type;
      return (
        <React.Fragment key={i}>
          <TimeRange
            index={i}
            timeTo={timeToArray[i]}
            timeFrom={timeFromArray[i]}
            isDisabled={isDisabled}
            datasource={selectedDatasource}
            geometry={geometry}
            token={token}
            mode={mode}
          />
          {i > 0 ? (
            <button
              name={i}
              onClick={handleDeleteTimeRange}
              className="secondary-button secondary-button--cancel"
            >
              Delete Timerange
            </button>
          ) : null}
          {i < timerangeLength - 1 ? <hr className="mb-1 mt-1"></hr> : null}
        </React.Fragment>
      );
    });
  };

  const handleAddTimerange = () => {
    store.dispatch(requestSlice.actions.addTimeRange());
  };
  const handleDeleteTimeRange = (e) => {
    store.dispatch(requestSlice.actions.deleteTimerange(e.target.name));
  };

  const canHaveMultipleTimeRanges = useMemo(() => {
    return multipleTimeRangeIsValid(mode, isOnDatafusion);
  }, [mode, isOnDatafusion]);

  return (
    <>
      <h2 className="heading-secondary">Time Range</h2>
      <div
        className="form"
        style={{
          overflowY: `${canHaveMultipleTimeRanges ? 'scroll' : 'initial'}`,
          maxHeight: `${canHaveMultipleTimeRanges ? '330px' : ''}`,
        }}
      >
        {!isOnDatafusion && (
          <div className="flex items-center mb-2">
            <label htmlFor="toggle-timerange" className="form__label cursor-pointer mr-2">
              {isDisabled ? 'Enable timerange' : 'Disable timerange'}
            </label>
            <Toggle id="toggle-timerange" onChange={handleDisableTimerange} checked={isDisabled} />
          </div>
        )}

        {generateTimeRangesJSX(canHaveMultipleTimeRanges)}

        {canHaveMultipleTimeRanges && timeToArray.length < dataCollections.length ? (
          <>
            <button className="secondary-button mt-2 w-fit" onClick={handleAddTimerange}>
              Add Timerange
            </button>

            <p className="text mt-2">
              <i>Note: Data collections that don't have a timerange defined will use the first one</i>
            </p>
          </>
        ) : null}
      </div>
    </>
  );
};
const mapStateToProps = (store) => ({
  timeToArray: store.request.timeTo,
  timeFromArray: store.request.timeFrom,
  isDisabled: store.request.isTimeRangeDisabled,
  dataCollections: store.request.dataCollections,
  mode: store.request.mode,
  token: store.auth.user.access_token,
  geometry: store.map.wgs84Geometry,
});

export default connect(mapStateToProps)(TimeRangeContainer);
