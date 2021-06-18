import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import TimeRange from './TimeRange';
import store from '../../../store';
import requestSlice from '../../../store/request';
import Toggle from '../Toggle';
import { DATAFUSION, DEM } from '../../../utils/const/const';

const multipleTimeRangeIsValid = (mode, datasource) => {
  return (mode === 'PROCESS' || mode === 'BATCH') && datasource === DATAFUSION;
};

const supportsTimeRange = (datasource) => !(datasource === DEM);

const TimeRangeContainer = ({
  timeToArray,
  timeFromArray,
  isDisabled,
  mode,
  datafusionSources,
  datasource,
  geometry,
  token,
}) => {
  useEffect(() => {
    if (!supportsTimeRange(datasource)) {
      store.dispatch(requestSlice.actions.disableTimerange(true));
    }
  }, [datasource]);

  const handleDisableTimerange = () => {
    if (supportsTimeRange(datasource)) {
      store.dispatch(requestSlice.actions.disableTimerange(!isDisabled));
    }
  };

  const generateTimeRangesJSX = () => {
    const timerangeLength = timeToArray.length;
    return timeToArray.map((timeTo, i) => {
      // If datafusion select the proper datasource.
      const selectedDatasource = datasource === DATAFUSION ? datafusionSources[i].datasource : datasource;
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
          {i < timerangeLength - 1 ? <hr className="u-margin-bottom-tiny u-margin-top-tiny"></hr> : null}
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

  const canAddTimeRange = () => {
    return (
      timeFromArray.length < datafusionSources.length &&
      timeToArray.length < datafusionSources.length &&
      multipleTimeRangeIsValid(mode, datasource)
    );
  };

  return (
    <>
      <h2 className="heading-secondary">Time Range</h2>
      <div
        className="form"
        style={{
          overflowY: `${multipleTimeRangeIsValid(mode, datasource) ? 'scroll' : 'initial'}`,
          maxHeight: `${multipleTimeRangeIsValid(mode, datasource) ? '224px' : ''}`,
        }}
      >
        <div className="toggle-with-label">
          <label htmlFor="toggle-timerange" className="form__label">
            {isDisabled ? 'Enable timerange' : 'Disable timerange'}
          </label>
          <Toggle id="toggle-timerange" onChange={handleDisableTimerange} checked={isDisabled} />
        </div>

        {generateTimeRangesJSX()}

        {canAddTimeRange() ? (
          <>
            <button className="secondary-button" onClick={handleAddTimerange}>
              Add Timerange
            </button>

            <p className="text u-margin-top-small">
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
  datasource: store.request.datasource,
  mode: store.request.mode,
  datafusionSources: store.request.datafusionSources,
  token: store.auth.user.access_token,
  geometry: store.map.wgs84Geometry,
});

export default connect(mapStateToProps)(TimeRangeContainer);
