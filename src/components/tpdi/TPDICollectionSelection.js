import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import Axios from 'axios';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { isAirbus } from './utils';
import FieldWithManualEntry from '../common/FieldWithManualEntry';
import Toggle from '../common/Toggle';

const SEARCH_COLLECTIONS_PAYLOAD = {
  input: {
    bounds: {
      bbox: [12.44693, 41.870072, 12.541001, 41.917096],
    },
    data: [
      {
        dataFilter: {
          timeRange: {
            from: '2021-08-29T00:00:00Z',
            to: '2021-09-29T23:59:59Z',
          },
        },
      },
    ],
  },
};

const buildSearchCompatibleCollectionsPayload = (provider, productBundle) => {
  const payload = Object.assign({}, SEARCH_COLLECTIONS_PAYLOAD);

  if (isAirbus(provider)) {
    payload.input.provider = 'AIRBUS';
    payload.input.data[0].constellation = provider.split('_').slice(-1)[0];
  }
  if (provider === 'PLANET') {
    payload.input.data[0].productBundle = productBundle;
    payload.input.data[0].itemType = 'PSScene4Band';
  }

  return payload;
};

const TPDICollectionSelection = ({ provider, token, collectionId, isCreatingCollection }) => {
  const [tpdiCollections, setTpdiCollections] = useState([]);

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const fetchTpdiCollections = async () => {
      try {
        let res = await TpdiResource.searchCompatibleCollections(
          buildSearchCompatibleCollectionsPayload(provider),
          { cancelToken: source.token },
        );
        if (res.data) {
          let collections = res.data.data;
          if (collections !== undefined) {
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
  }, [token, provider]);

  const handleTpdiCollectionChange = (value) => {
    store.dispatch(tpdiSlice.actions.setCollectionId(value));
  };

  return (
    <>
      {!isCreatingCollection && (
        <FieldWithManualEntry
          onChange={handleTpdiCollectionChange}
          value={collectionId}
          options={tpdiCollections.map((col) => ({ name: col.name, value: col.id }))}
          inputPlaceholder="Write your collection id"
        />
      )}
      <div className="flex items-center mb-2 ml-1">
        <label className="form__label mr-2 cursor-pointer font-normal" htmlFor="is-creating-tpdi-collection">
          {isCreatingCollection ? 'Creating new collection' : 'or create a new collection'}
        </label>
        <Toggle
          checked={isCreatingCollection}
          onChange={() => store.dispatch(tpdiSlice.actions.setIsCreatingCollection(!isCreatingCollection))}
          id="is-creating-tpdi-collection"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  collectionId: state.tpdi.collectionId,
  isCreatingCollection: state.tpdi.isCreatingCollection,
});

export default connect(mapStateToProps)(TPDICollectionSelection);
