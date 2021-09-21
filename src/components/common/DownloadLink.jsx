import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { triggerDownload } from '../statistical/response/HistogramChart';

const DownloadLink = ({ url, format }) => {
  const handleDownload = () => {
    triggerDownload(url, `${url.split('/').slice(-1)}.${format}`);
  };
  return (
    <p className="underline text text--bold cursor-pointer text-lg" onClick={handleDownload}>
      <FontAwesomeIcon icon={faSave} style={{ marginRight: '2rem' }} />
      Click here to download the response
    </p>
  );
};

export default DownloadLink;
