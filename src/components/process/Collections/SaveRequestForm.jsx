import React, { useState } from 'react';
import store from '../../../store';
import savedRequestsSlice from '../../../store/savedRequests';
import Select from '../../common/Select';

const CollectionSelectorField = ({
  collections,
  selectedPrimaryKey,
  setSelectedPrimaryKey,
  collectionName,
  setCollectionName,
}) => {
  const hasCollections = collections.length > 0;
  const [isOnManualEntry, setIsOnManualEntry] = useState(false);

  const handleInputChange = (e) => {
    setCollectionName(e.target.value);
  };
  const handleSelectChange = (value) => {
    if (value === 'MANUAL') {
      setIsOnManualEntry(true);
      setSelectedPrimaryKey(undefined);
      setCollectionName('');
    } else {
      setSelectedPrimaryKey(value);
    }
  };
  return (
    <>
      {hasCollections ? (
        <>
          <Select
            label="Collection Name"
            options={[
              { name: 'New Collection', value: 'MANUAL' },
              ...collections.map((col) => ({
                name: col.collectionName,
                value: col.primaryKey,
              })),
            ]}
            selected={selectedPrimaryKey}
            onChange={handleSelectChange}
            optionsClassNames="w-fit min-w-full"
            buttonClassNames="mb-2"
          />
          {isOnManualEntry && (
            <input
              className="form__input mb-2"
              onChange={handleInputChange}
              value={collectionName}
              placeholder="Collection Name"
            />
          )}
        </>
      ) : (
        <>
          <label className="form__label mt-2">Collection Name</label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="form__input mb-2"
          />
        </>
      )}
    </>
  );
};
const SaveRequestForm = ({
  stringRequest,
  response,
  mode,
  hasSavedRequest,
  setHasSavedRequest,
  savedRequests,
}) => {
  const [requestName, setRequestName] = useState('');
  const [collectionName, setCollectionName] = useState(savedRequests[0]?.collectionName ?? '');
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState(savedRequests[0]?.primaryKey);

  const handleSaveRequest = (e) => {
    e.preventDefault();
    setHasSavedRequest(true);
    store.dispatch(
      savedRequestsSlice.actions.appendRequest({
        request: {
          name: requestName,
          request: stringRequest,
          response,
          mode,
        },
        collectionName,
        primaryKey: selectedPrimaryKey,
      }),
    );
  };

  const handleNameRequestChange = (e) => {
    setRequestName(e.target.value);
  };
  return (
    <div className="flex flex-col items-center justify-center max-w-xl pb-2 mb-1 border-b lg:flex-row">
      <form className="flex flex-col items-center" style={{ width: '70%' }} onSubmit={handleSaveRequest}>
        <label className="form__label mt-2" htmlFor="name-request-input">
          Request name (optional)
        </label>
        <input
          autoComplete="off"
          value={requestName}
          type="text"
          placeholder="Add an optional name to your saved request"
          className="form__input mb-2"
          id="name-request-input"
          onChange={handleNameRequestChange}
        />
        <CollectionSelectorField
          collections={savedRequests}
          collectionName={collectionName}
          setCollectionName={setCollectionName}
          selectedPrimaryKey={selectedPrimaryKey}
          setSelectedPrimaryKey={setSelectedPrimaryKey}
        />
        <button
          className={`secondary-button ${
            hasSavedRequest || collectionName === '' ? 'secondary-button--disabled' : ''
          }`}
          type="submit"
          disabled={hasSavedRequest || collectionName === ''}
        >
          {hasSavedRequest ? 'Saved' : 'Save Request'}
        </button>
      </form>
      <div className="info-banner mr-2">
        <p>
          Saved requests will only last until the page is refreshed! Remember to export your requests before
          closing the tab.
        </p>
      </div>
    </div>
  );
};

export default SaveRequestForm;
