import React, { useState } from 'react';
import ProcessSavedRequestEntry from './ProcessSavedRequestEntry';
import SavedCollectionHeader from './SavedCollectionHeader';
import StatisticalSavedRequestEntry from './StatisticalSavedRequestEntry';

const SavedCollection = ({ collection, token }) => {
  const [isCollectionExpanded, setIsCollectionExpanded] = useState(false);
  return (
    <div className="mb-2">
      <SavedCollectionHeader
        collectionName={collection.collectionName}
        primaryKey={collection.primaryKey}
        isExpanded={isCollectionExpanded}
        setIsExpanded={setIsCollectionExpanded}
      />
      <div className={`pl-5 pr-2 bg-primary-light ${isCollectionExpanded ? 'py-2' : ''}`}>
        {isCollectionExpanded &&
          collection.requests.map((savedReq, idx) => {
            if (savedReq.mode === 'STATISTICAL') {
              return (
                <StatisticalSavedRequestEntry
                  creationTime={savedReq.creationTime}
                  key={idx}
                  mode={savedReq.mode}
                  name={savedReq.name}
                  request={savedReq.request}
                  response={savedReq.response}
                  token={token}
                  idx={idx}
                  primaryKey={collection.primaryKey}
                />
              );
            }
            if (savedReq.mode === 'PROCESS') {
              return (
                <ProcessSavedRequestEntry
                  creationTime={savedReq.creationTime}
                  key={idx}
                  mode={savedReq.mode}
                  name={savedReq.name}
                  request={savedReq.request}
                  response={savedReq.response}
                  idx={idx}
                  primaryKey={collection.primaryKey}
                  token={token}
                />
              );
            }
            return null;
          })}
        {isCollectionExpanded && collection.requests.length === 0 && (
          <p>No requests saved on this collection</p>
        )}
      </div>
    </div>
  );
};

export default SavedCollection;
