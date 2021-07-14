import React, { useRef, useState, useEffect } from 'react';

import DownloadLink from '../DownloadLink';
import OgcFisResponse from '../../wms/FisResponse';
import StatisticalResponse from '../../statistical/response/StatisticalResponse';
import { isEmpty } from '../../../utils/commonUtils';

const StatisticalResponseContainer = ({ statisticalResponse, mode }) => {
  const containerRef = useRef();
  const [downloadUrl, setDownloadUrl] = useState();
  const isEmptyResponse = isEmpty(statisticalResponse);
  const isValidStatApiResponse = Boolean(statisticalResponse?.data?.length);
  const isFisResponse = mode === 'WMS';

  useEffect(() => {
    let srcUrl;
    if (!isEmptyResponse) {
      srcUrl = URL.createObjectURL(
        new Blob([JSON.stringify(statisticalResponse, null, 2)], { type: 'application/json' }),
      );
      setDownloadUrl(srcUrl);
    }
    return () => {
      URL.revokeObjectURL(srcUrl);
    };
    // eslint-disable-next-line
  }, []);

  if (isFisResponse) {
    return <OgcFisResponse statisticalResponse={statisticalResponse} url={downloadUrl} />;
  }

  if (!statisticalResponse || isEmptyResponse) {
    return <p className="text text--warning">Error: NO DATA!</p>;
  }

  if (statisticalResponse.status === 'FAILED' || !isValidStatApiResponse) {
    return <p className="text text--warning">Something went wrong.</p>;
  }

  return (
    <div className="p-4 w-full h-full" ref={containerRef}>
      <div className="flex items-center">
        <DownloadLink url={downloadUrl} />
      </div>
      <StatisticalResponse response={statisticalResponse} containerRef={containerRef} />
    </div>
  );
};

export default StatisticalResponseContainer;
