import React, { useState } from 'react';
import BatchRequestPreview from '../components/batch/BatchRequestPreview';
import DataSourceSelect from '../components/common/DataSourceSelect';
import EvalscriptEditor from '../components/common/Evalscript/EvalscriptEditor';
import BatchOptions from '../components/batch/BatchOptions';
import BatchActions from '../components/batch/BatchActions';
import MapContainer from '../components/common/Map/MapContainer';
import BatchInformation from '../components/batch/BatchInformation';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import BatchOutput from '../components/batch/BatchOutput';

const BatchRequestForm = () => {
  const [fetchedRequests, setFetchedRequests] = useState([]);

  return (
    <div>
      <div className="process-first-row">
        <div className="process-first-row-first-item">
          <DataSourceSelect />
        </div>
        <div className="process-first-row-second-item">
          <TimeRangeContainer />
          <BatchOutput />
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
          <BatchRequestPreview setFetchedRequests={setFetchedRequests} />
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
