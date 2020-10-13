import React, { useEffect, useState } from 'react';
import { getCustomCollections } from '../process/requests';
import { connect } from 'react-redux';
import store, { tpdiSlice } from '../../store';
import Axios from 'axios';

const TPDICollectionSelection = ({ token }) => {
  const [tpdiCollections, setTpdiCollections] = useState([]);

  useEffect(() => {
    let source = Axios.CancelToken.source();
    const fetchTpdiCollections = async () => {
      try {
        let res = await getCustomCollections(token, undefined, { cancelToken: source.token });
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
    store.dispatch(tpdiSlice.actions.setCollectionId(e.target.value));
  };

  return (
    <>
      {tpdiCollections.length > 0 ? (
        <select onChange={handleTpdiCollectionChange} className="form__input">
          <option value="">Select a TPDI Collection</option>
          {tpdiCollections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDICollectionSelection);
