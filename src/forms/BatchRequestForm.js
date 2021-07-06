import React, { useCallback, useState } from 'react';
import BatchRequestPreview from '../components/batch/BatchRequestPreview';
import DataSourceSelect from '../components/common/DataSourceSelect';
import EvalscriptEditor from '../components/common/Evalscript/EvalscriptEditor';
import BatchOptions from '../components/batch/BatchOptions';
import MapContainer from '../components/common/Map/MapContainer';
import BatchInformation from '../components/batch/BatchInformation';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import BatchOutput from '../components/batch/BatchOutput';
import RunningRequestIndicator from '../components/common/RunningRequestIndicator';

const BatchRequestForm = () => {
  const [fetchedRequests, setFetchedRequests] = useState([]);
  const [createResponse, setCreateResponse] = useState();
  const [getAllResponse, setGetAllResponse] = useState();
  const [singleResponse, setSingleResponse] = useState();
  const [tilesResponse, setTilesResponse] = useState();
  // createdContainer, runningContainer, finishedContainer
  const [openedContainers, setOpenedContainers] = useState([true, true, false]);

  // open container callbacks
  const openOnlyCreateContainer = useCallback(() => {
    setOpenedContainers([true, false, false]);
  }, []);

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

      <div className="process-second-row mb-4">
        <div className="process-second-row-first-item">
          <EvalscriptEditor />
        </div>
        <div className="process-second-row-second-item">
          <BatchRequestPreview
            setFetchedRequests={setFetchedRequests}
            createResponse={createResponse}
            getAllResponse={getAllResponse}
            singleResponse={singleResponse}
            tilesResponse={tilesResponse}
          />
        </div>
      </div>

      <div className="batch-third-row">
        <div className="batch-third-row-first-item">
          <BatchOptions
            openOnlyCreateContainer={openOnlyCreateContainer}
            setFetchedRequests={setFetchedRequests}
            setCreateResponse={setCreateResponse}
          />
        </div>
        <div className="batch-third-row-second-item">
          <BatchInformation
            setFetchedRequests={setFetchedRequests}
            fetchedRequests={fetchedRequests}
            setGetAllResponse={setGetAllResponse}
            setTilesResponse={setTilesResponse}
            setSingleResponse={setSingleResponse}
            openedContainers={openedContainers}
            setOpenedContainers={setOpenedContainers}
          />
        </div>
      </div>
      <RunningRequestIndicator />
    </div>
  );
};

export default BatchRequestForm;
