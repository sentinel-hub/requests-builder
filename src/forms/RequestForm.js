import React from 'react';
import DataSourceSelect from '../components/common/DataSourceSelect';
import Output from '../components/common/Output';
import EvalscriptEditor from '../components/common/Evalscript/EvalscriptEditor';
import RequestPreview from '../components/process/RequestPreview';
import MapContainer from '../components/common/Map/MapContainer';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import RunningRequestIndicator from '../components/common/RunningRequestIndicator';

const RequestForm = () => {
  return (
    <div>
      <div className="process-first-row">
        <div className="process-first-row-first-item">
          <DataSourceSelect />
        </div>
        <div className="process-first-row-second-item">
          <TimeRangeContainer />
          <div className="output mt-4 md:mt-2">
            <Output />
          </div>
        </div>
        <div className="process-first-row-third-item">
          <MapContainer />
        </div>
      </div>
      <div className="process-second-row">
        <div className="process-second-row-first-item">
          <EvalscriptEditor />
        </div>
        <div className="process-second-row-second-item">
          <RequestPreview />
        </div>
      </div>
      <RunningRequestIndicator />
    </div>
  );
};

export default RequestForm;
