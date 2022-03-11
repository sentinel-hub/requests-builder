import React from 'react';
import { connect } from 'react-redux';
import { FolderIcon, SaveIcon } from '@heroicons/react/solid';
import store from '../../../store';
import savedRequestsSlice from '../../../store/savedRequests';
import alertSlice, { addWarningAlert } from '../../../store/alert';
import { insertCollections } from '../../../indexeddb';
import SavedCollection from './SavedCollection';
import ExportCollection from './ExportCollection';

export const isUnnamedCollectionName = (collectionName) =>
  collectionName.toLowerCase().includes('unnamed collection');

const getUnnamedCollectionName = (collections) => {
  const amount = collections.filter((c) => isUnnamedCollectionName(c.collectionName)).length;
  if (amount === 0) {
    return 'Unnamed Collection';
  }
  return `Unnamed Collection ${amount + 1}`;
};

const doesModeSupportSaving = (mode) => mode === 'PROCESS' || mode === 'STATISTICAL' || mode === 'BATCH';

const MODE_TO_RIGHT_POS = (mode) => {
  switch (mode) {
    case 'PROCESS':
      return '220px';
    case 'STATISTICAL':
      return '230px';
    case 'WMS':
    case 'BATCH':
      return '10px';
    default:
      return 0;
  }
};

const handleUploadedCollectionParsing = (parsedData, savedRequests) => {
  const overridedCollections = [];
  // New format
  if (parsedData[0]?.requests !== undefined) {
    parsedData.forEach((parsedCollection) => {
      const { primaryKey, collectionName } = parsedCollection;
      if (primaryKey && collectionName) {
        if (savedRequests.find((collection) => collection.primaryKey === primaryKey)) {
          // override collection
          store.dispatch(savedRequestsSlice.actions.setCollection({ collection: parsedCollection }));
          overridedCollections.push(parsedCollection.collectionName);
        } else {
          store.dispatch(savedRequestsSlice.actions.appendCollection({ collection: parsedCollection }));
        }
      }
    });
  } else {
    // Old format
    const name = getUnnamedCollectionName(savedRequests);
    store.dispatch(
      savedRequestsSlice.actions.addOldFormatCollection({
        requests: parsedData,
        collectionName: name,
      }),
    );
  }

  return overridedCollections;
};

const SavedRequests = ({ savedRequests, mode, expandedSidebar, token }) => {
  const handleExpand = () => {
    store.dispatch(savedRequestsSlice.actions.setExpandedSidebar(!expandedSidebar));
  };

  if (!doesModeSupportSaving(mode)) {
    return null;
  }

  const handleImportButtonClick = () => {
    const fileEl = document.getElementById('collection-file-input');
    fileEl.click();
  };

  const hasUnnamedCollections = savedRequests.find((col) => isUnnamedCollectionName(col.collectionName));

  const handleImport = async () => {
    const fileEl = document.getElementById('collection-file-input');
    const file = fileEl.files[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    try {
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          handleUploadedCollectionParsing(parsed, savedRequests);
          store.dispatch(
            alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Collection upload successfully' }),
          );
        } else {
          addWarningAlert('Invalid collections content');
        }
      }
    } catch (err) {
      store.dispatch(
        alertSlice.actions.addAlert({
          type: 'WARNING',
          text: 'Something went wrong while loading the collection',
        }),
      );
      console.error('Something went wrong while loading the collection: ', err);
    }
  };

  const handleSaveToIndexedDb = () => {
    if (hasUnnamedCollections) {
      addWarningAlert('Rename unnammed collections to proceed');
      return;
    }
    insertCollections(savedRequests);
  };

  return (
    <div className="ml-2 fixed z-50" style={{ right: MODE_TO_RIGHT_POS(mode) }}>
      <button className="primary-button flex items-center" onClick={handleExpand}>
        <FolderIcon className="w-5 mr-1" />
        Requests
      </button>
      {expandedSidebar && (
        <div className="block fixed right-0 w-96 h-96 p-2 text-black bg-primary-lighter overflow-y-scroll">
          <button className="tertiary-button my-2 flex items-center" onClick={handleSaveToIndexedDb}>
            <SaveIcon className="w-6 mr-1" /> Save locally
          </button>
          {savedRequests.map((collection) => (
            <SavedCollection collection={collection} token={token} key={collection.primaryKey} />
          ))}
          {savedRequests.length === 0 && (
            <p className="text">
              <span>Send a request and save it to see it here!</span>
            </p>
          )}
          <p className="text mt-1 mb-1">
            <span className="block">
              <i>Note: Saved request are stored locally and can be removed by deleting the cache.</i>
            </span>
            <span className="block">
              <i>Saved requests are not tied to your account but to your browser.</i>
            </span>
            <span className="block" style={{ display: 'block' }}>
              <i>
                Remember to click the <b>Save locally</b> to persist them or export them to a local file.
              </i>
            </span>
          </p>
          <div className="flex flex-col">
            <div className="flex items-center">
              {!hasUnnamedCollections && <ExportCollection savedCollections={savedRequests} />}
              <input
                type="file"
                id="collection-file-input"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
              <button className="tertiary-button mt-2" onClick={handleImportButtonClick}>
                Upload collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  savedRequests: state.savedRequests.savedRequests,
  expandedSidebar: state.savedRequests.expandedSidebar,
  mode: state.request.mode,
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(SavedRequests);
