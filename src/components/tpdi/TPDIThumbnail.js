import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';

import { getProductThumbnail } from './generateTPDIRequests';

const TPDIThumbnail = ({ collectionId, productId, token }) => {
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(true);
  const [srcUrl, setSrcUrl] = useState();

  useEffect(() => {
    let axiosSource = Axios.CancelToken.source();
    const fetchThumbnail = async () => {
      try {
        setIsFetchingThumbnail(true);
        const res = await getProductThumbnail(productId, collectionId, token, {
          cancelToken: axiosSource.token,
        });
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
            content={<img src={srcUrl} style={{ maxHeight: '70vh' }} alt={`${productId}-thumbnail`} />}
          />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDIThumbnail);