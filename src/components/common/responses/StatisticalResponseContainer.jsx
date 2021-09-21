import React, { useRef } from 'react';

import DownloadLink from '../DownloadLink';
import OgcFisResponse from '../../wms/FisResponse';
import StatisticalResponse from '../../statistical/response/StatisticalResponse';
import { isEmpty } from '../../../utils/commonUtils';
import { useDownloadLink } from '../../../utils/hooks';

const StatisticalResponseContainer = ({ statisticalResponse, mode }) => {
  const containerRef = useRef();
  const downloadUrl = useDownloadLink(statisticalResponse);
  const isEmptyResponse = isEmpty(statisticalResponse);
  const isValidStatApiResponse = Boolean(statisticalResponse?.data?.length);
  const isFisResponse = mode === 'WMS';

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
        <DownloadLink url={downloadUrl} format="json" />
      </div>
      <StatisticalResponse response={statisticalResponse} containerRef={containerRef} />
    </div>
  );
};

export default StatisticalResponseContainer;
