import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import BaseModal from './BaseModal';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { uuidv4 } from '../../store/alert';
import store from '../../store';
import mapSlice from '../../store/map';

const TPDIThumbnail = ({ collectionId, productId, geometry }) => {
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(true);
  const [srcUrl, setSrcUrl] = useState();
  const handleAddToMap = () => {
    const uuid = uuidv4();
    store.dispatch(mapSlice.actions.addAdditionalLayer({ url: srcUrl, geometry: geometry, uuid }));
  };

  useEffect(() => {
    let axiosSource = Axios.CancelToken.source();
    const fetchThumbnail = async () => {
      try {
        setIsFetchingThumbnail(true);
        const res = await TpdiResource.getThumbnail(
          { productId, collectionId },
          { cancelToken: axiosSource.token, responseType: 'blob' },
        );
        const source = URL.createObjectURL(res.data);
        setSrcUrl(source);
        setIsFetchingThumbnail(false);
      } catch (err) {
        if (!Axios.isCancel(err)) {
          console.error(err);
        }
      }
    };
    fetchThumbnail();

    return () => {
      if (srcUrl) {
        URL.revokeObjectURL(srcUrl);
      }
      if (axiosSource) {
        axiosSource.cancel();
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="u-flex-column-centered" style={{ marginLeft: '2rem' }}>
      <p className="text" style={{ marginBottom: '1rem' }}>
        <span>Thumbnail</span>
      </p>
      {isFetchingThumbnail ? (
        <p className="text">Fetching...</p>
      ) : (
        <>
          <BaseModal
            trigger={
              <div className="u-flex-aligned" style={{ cursor: 'pointer', height: '100%' }}>
                <img src={srcUrl} alt={`${productId}-thumbnail-miniature`} style={{ height: '100px' }} />
                <FontAwesomeIcon icon={faExpandArrowsAlt} style={{ marginLeft: '1rem', fontSize: '2rem' }} />
              </div>
            }
            content={
              <div className="u-flex-column-centered">
                <img src={srcUrl} style={{ maxHeight: '70vh' }} alt={`${productId}-thumbnail`} />
                <button className="secondary-button" onClick={handleAddToMap}>
                  Add to map
                </button>
                <p className="text text--warning u-margin-top-tiny">
                  Thumbnail is not georeferenced so the resulting map layer is just an approximation. <br />
                  Check the product geometry to see the exact polygon that will be ordered.
                </p>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};

export default TPDIThumbnail;
