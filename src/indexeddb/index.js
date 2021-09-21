import store from '../store';
import { addSuccessAlert, addWarningAlert } from '../store/alert';
import savedRequestsSlice from '../store/savedRequests';
import { collectionToExportCollection } from '../components/process/Collections/ExportCollection';
import { getUrlParams, loadUrlCollection } from '../params';

let db;
const OBJ_STORAGE_NAME = 'Requests';
const DB_NAME = 'REQUESTS_BUILDER_DB';
const VERSION = 1;

export const configureIndexedDb = () => {
  const request = indexedDB.open(DB_NAME, VERSION);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore(OBJ_STORAGE_NAME, { keyPath: 'primaryKey' });
  };

  request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    readAllRequests();
  };
};

export const insertCollections = (collections) => {
  if (!db) {
    return;
  }

  const txn = db.transaction(OBJ_STORAGE_NAME, 'readwrite');

  const store = txn.objectStore(OBJ_STORAGE_NAME);

  const allStoredCollectionsQuery = store.getAll();

  allStoredCollectionsQuery.onsuccess = (event) => {
    const allStoredCollections = event.target.result;
    const toDelete = allStoredCollections.filter(
      (storedCollection) =>
        !collections.find((stateCollection) => stateCollection.primaryKey === storedCollection.primaryKey),
    );
    const toUpdateOrCreate = collections.filter(
      (stateCollection) =>
        !toDelete.find((toDelCollection) => toDelCollection.primaryKey === stateCollection.primaryKey),
    );
    toUpdateOrCreate.forEach((collection) => {
      const collectionToStore = collectionToExportCollection(collection);
      store.put(collectionToStore);
    });
    toDelete.forEach((collection) => {
      store.delete(collection.primaryKey);
    });
    addSuccessAlert(`Saved collections local storage successfully updated`);
  };
};

export const readAllRequests = () => {
  if (!db) {
    return;
  }
  const txn = db.transaction(OBJ_STORAGE_NAME, 'readonly');
  const objStore = txn.objectStore(OBJ_STORAGE_NAME);
  const query = objStore.getAll();

  query.onsuccess = function (event) {
    if (event.target.result && event.target.result.length > 0) {
      store.dispatch(savedRequestsSlice.actions.setCollections(event.target.result));
      loadUrlCollection(getUrlParams());
    }
  };

  query.onerror = function (event) {
    addWarningAlert("Request couldn't be loaded, check console for more details");
  };
};
