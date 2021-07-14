import React from 'react';
import DownloadLink from '../common/DownloadLink';

const OgcFisResponse = ({ url, statisticalResponse }) => {
  return (
    <>
      <DownloadLink url={url} />
      <textarea
        rows="30"
        cols="50"
        defaultValue={JSON.stringify(statisticalResponse, null, 2)}
        className="p-3 border border-primary focus:outline-none focus:border-2 rounded-md mt-2"
      />
    </>
  );
};

export default OgcFisResponse;
