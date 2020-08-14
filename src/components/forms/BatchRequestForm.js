import React, { useState } from 'react';
import BatchRequestPreview from '../output/BatchRequestPreview';
import DataSourceSelect from '../input/DataSourceSelect';
import TimeRangeSelect from '../input/TimeRangeSelect';
import Output from '../output/Output';
import EvalscriptEditor from '../input/EvalscriptEditor';
import BatchOptions from '../batch/BatchOptions';
import BatchActions from '../batch/BatchActions';
import MapContainer from '../input/MapContainer';
import BatchInformation from '../batch/BatchInformation';

const BatchRequestForm = () => {
  const [fetchedRequests, setFetchedRequests] = useState([]);

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

      <div className="process-second-row u-margin-bottom-medium">
        <div className="process-second-row-first-item">
          <EvalscriptEditor />
        </div>
        <div className="process-second-row-second-item">
          <BatchRequestPreview />
        </div>
      </div>

      <div className="batch-third-row">
        <div className="batch-third-row-first-item">
          <BatchOptions setFetchedRequests={setFetchedRequests} />
          <BatchActions setFetchedRequests={setFetchedRequests} />
        </div>
        <div className="batch-third-row-second-item">
          <BatchInformation setFetchedRequests={setFetchedRequests} fetchedRequests={fetchedRequests} />
        </div>
      </div>
    </div>
  );
};

export default BatchRequestForm;
