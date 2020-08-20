import React from 'react';
import DataSourceSelect from '../input/DataSourceSelect';
import TimeRangeSelect from '../input/TimeRangeSelect';
import Output from '../output/Output';
import EvalscriptEditor from '../Evalscript/EvalscriptEditor';
import RequestPreview from '../output/RequestPreview';
import MapContainer from '../input/MapContainer';

const RequestForm = () => {
  return (
    <div>
      <div className="process-first-row">
        <div className="process-first-row-first-item">
          <DataSourceSelect />
        </div>
        <div className="process-first-row-second-item">
          <TimeRangeSelect />
          <div className="output u-margin-top-small">
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
    </div>
  );
};

export default RequestForm;
