import React, { useCallback } from 'react';
import AnalyseBatchRequestButton from './AnalyseBatchRequestButton';
import CancelBatchRequestButton from './CancelBatchRequestButton';
import GetSingleRequestButton from './GetSingleRequestButton';
import RestartPartialRequestButton from './RestartPartialRequestButton';
import StartBatchRequestButton from './StartBatchRequestButton';

const BatchActions = ({ requestId, token, setSingleResponse, setFetchedRequests, setOpenedContainers }) => {
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
    <div className="batch-request-summary-actions">
      <AnalyseBatchRequestButton
        requestId={requestId}
        token={token}
        analyseRequest={curriyedUpdater({ userAction: 'ANALYSE', status: 'ANALYSING' })}
        setOpenedContainers={setOpenedContainers}
      />
      <StartBatchRequestButton
        requestId={requestId}
        token={token}
        startRequest={curriyedUpdater({ userAction: 'START' })}
        setOpenedContainers={setOpenedContainers}
      />
      <CancelBatchRequestButton
        requestId={requestId}
        token={token}
        cancelRequest={curriyedUpdater({ userAction: 'CANCEL' })}
      />
      <RestartPartialRequestButton requestId={requestId} token={token} />
      <GetSingleRequestButton
        requestId={requestId}
        token={token}
        setSingleResponse={setSingleResponse}
        curriyedUpdater={curriyedUpdater}
        setOpenedContainers={setOpenedContainers}
      />
    </div>
  );
};

export default BatchActions;
