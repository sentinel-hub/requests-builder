import React, { useRef, useState, useEffect } from 'react';

import { isEmpty } from '../../../utils/const';
import DownloadLink from '../DownloadLink';
import OgcFisResponse from '../../wms/FisResponse';
import StatisticalResponse from '../../statistical/response/StatisticalResponse';

const StatisticalResponseContainer = ({ statisticalResponse, request }) => {
  const containerRef = useRef();
  const [downloadUrl, setDownloadUrl] = useState();
  const isEmptyResponse = isEmpty(statisticalResponse);

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

  const responseData = statisticalResponse?.data ? statisticalResponse.data[0] : null;

  if (!responseData && isEmptyResponse) {
    return <p className="text text--warning">Error: NO DATA!</p>;
  }

  if (!responseData && !isEmptyResponse) {
    return <OgcFisResponse statisticalResponse={statisticalResponse} url={downloadUrl} />;
  }

  return (
    <div className="statistical-response" ref={containerRef}>
      <div className="u-flex-aligned">
        <DownloadLink url={downloadUrl} />
      </div>
      <StatisticalResponse response={statisticalResponse} containerRef={containerRef} />
    </div>
  );
};

export default StatisticalResponseContainer;
