import React from 'react';
import { useDownloadLink } from '../../../utils/hooks';
import DownloadLink from '../DownloadLink';

const WfsResponse = ({ response }) => {
  const downloadLink = useDownloadLink(response);

  return (
    <div className="h-1/2 flex flex-col">
      {downloadLink && <DownloadLink url={downloadLink} format="json" />}
      <textarea rows="25" cols="50" value={JSON.stringify(response, null, 2)} className="mt-2 p-3" />
    </div>
  );
};

export default WfsResponse;
