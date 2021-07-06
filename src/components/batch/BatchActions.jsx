import React, { useCallback } from 'react';
import Tooltip from '../common/Tooltip/Tooltip';
import AnalyseBatchRequestButton from './AnalyseBatchRequestButton';
import CancelBatchRequestButton from './CancelBatchRequestButton';
import GetSingleRequestButton from './GetSingleRequestButton';
import { canAnalyse, canStart, canCancel, canRestart } from './lib/utils';
import RestartPartialRequestButton from './RestartPartialRequestButton';
import StartBatchRequestButton from './StartBatchRequestButton';

const BatchActions = ({
  requestId,
  token,
  status,
  setSingleResponse,
  setFetchedRequests,
  setOpenedContainers,
  fetchTiles,
}) => {
  const curriyedUpdater = useCallback(
    (newItem, collapseAllExceptNew = true) => (requestId) => {
      setFetchedRequests((prev) => {
        const idx = prev.findIndex((req) => req.id === requestId);
        const updated = { ...prev[idx], ...newItem, isExpanded: true };
        if (collapseAllExceptNew) {
          return prev
            .map((item) => ({ ...item, isExpanded: false }))
            .slice(0, idx)
            .concat([updated, ...prev.slice(idx + 1)]);
        }
        return prev.slice(0, idx).concat([updated, ...prev.slice(idx + 1)]);
      });
    },
    [setFetchedRequests],
  );

  return (
    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-1 mr-1 h-fit mb-1">
      {canAnalyse(status) && (
        <div className="flex justify-between items-center">
          <AnalyseBatchRequestButton
            requestId={requestId}
            token={token}
            analyseRequest={curriyedUpdater({ userAction: 'ANALYSE', status: 'ANALYSING' })}
            setOpenedContainers={setOpenedContainers}
          />
          <Tooltip
            direction="right"
            content="Analysing the request will provide you with the approximate cost of the batch request"
          />
        </div>
      )}
      {canStart(status) && (
        <div className="flex justify-between items-center">
          <StartBatchRequestButton
            requestId={requestId}
            token={token}
            startRequest={curriyedUpdater({ userAction: 'START' })}
            setOpenedContainers={setOpenedContainers}
          />
          <Tooltip
            direction="bottom"
            content="Starting the request will start the processing and substract you with appropriate PUs"
          />
        </div>
      )}
      {canCancel(status) && (
        <CancelBatchRequestButton
          requestId={requestId}
          token={token}
          cancelRequest={curriyedUpdater({ userAction: 'CANCEL' })}
        />
      )}
      {canRestart(status) && (
        <div className="flex justify-between items-center">
          <RestartPartialRequestButton requestId={requestId} token={token} />
          <Tooltip
            direction="bottom"
            content="Restarting will retry the request in case it's partially processed"
          />
        </div>
      )}
      <GetSingleRequestButton
        requestId={requestId}
        token={token}
        setSingleResponse={setSingleResponse}
        curriyedUpdater={curriyedUpdater}
        setOpenedContainers={setOpenedContainers}
        fetchTiles={fetchTiles}
      />
    </div>
  );
};

export default BatchActions;
