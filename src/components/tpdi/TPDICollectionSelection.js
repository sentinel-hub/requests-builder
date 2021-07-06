import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import Axios from 'axios';
import ByocResource from '../../api/byoc/ByocResource';

const TPDICollectionSelection = ({ token, collectionId }) => {
  const [tpdiCollections, setTpdiCollections] = useState([]);
  const [isOnManualEntry, setIsOnManualEntry] = useState(true);

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const fetchTpdiCollections = async () => {
      try {
        let res = await ByocResource.getCollections(null, { cancelToken: source.token });
        if (res.data) {
          let collections = res.data.data.filter((col) => col.s3Bucket === 'sh.tpdi.byoc.eu-central-1');
          if (collections.length > 0) {
            setTpdiCollections(collections);
          }
        }
      } catch (err) {
        if (!Axios.isCancel(err)) {
          console.error(err);
        }
      }
    };
    if (token) {
      fetchTpdiCollections();
    }
    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [token]);

  const handleTpdiCollectionChange = (e) => {
    if (e.target.value === 'MANUAL') {
      setIsOnManualEntry(true);
      store.dispatch(tpdiSlice.actions.setCollectionId(''));
    } else {
      setIsOnManualEntry(false);
      if (e.target.value === 'CREATE') {
        store.dispatch(tpdiSlice.actions.setCollectionId(''));
      } else {
        store.dispatch(tpdiSlice.actions.setCollectionId(e.target.value));
      }
    }
  };

  const handleTpdiInputCollectionChange = (e) => {
    store.dispatch(tpdiSlice.actions.setCollectionId(e.target.value));
  };

  const stateCollectionIdToValue = (collectionId) => {
    if (isOnManualEntry) {
      return 'MANUAL';
    }
    if (collectionId === '') {
      return 'CREATE';
    }
    return collectionId;
  };

  return (
    <>
      <select
        value={stateCollectionIdToValue(collectionId)}
        onChange={handleTpdiCollectionChange}
        className="form__input mb-2"
      >
        <option value="CREATE">Create a new collection</option>
        <option value="MANUAL">Manual Entry</option>
        {tpdiCollections.length > 0 && (
          <optgroup label="Your collections">
            {tpdiCollections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {isOnManualEntry && (
        <input
          id="tpdi-collection-id"
          value={collectionId}
          placeholder="Enter your collection Id"
          type="text"
          className="form__input mb-2"
          onChange={handleTpdiInputCollectionChange}
          autoComplete="off"
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  collectionId: state.tpdi.collectionId,
});

export default connect(mapStateToProps)(TPDICollectionSelection);
