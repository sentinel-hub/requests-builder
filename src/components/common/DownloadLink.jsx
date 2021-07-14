import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DownloadLink = ({ url }) => {
  return (
    <a href={url} className="underline text text--bold" download>
      <FontAwesomeIcon icon={faSave} style={{ marginRight: '2rem' }} />
      Click here to download the response
    </a>
  );
};

export default DownloadLink;
