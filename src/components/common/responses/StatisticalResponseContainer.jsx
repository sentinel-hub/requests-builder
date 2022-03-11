import React, { useRef } from 'react';

import DownloadLink from '../DownloadLink';
import StatisticalResponse from '../../statistical/response/StatisticalResponse';
import { isEmpty } from '../../../utils/commonUtils';
import { useDownloadLink } from '../../../utils/hooks';

const StatisticalResponseContainer = ({ statisticalResponse, mode }) => {
  const containerRef = useRef();
  const downloadUrl = useDownloadLink(statisticalResponse);
  const isEmptyResponse = isEmpty(statisticalResponse);
  const isValidStatApiResponse = Boolean(statisticalResponse?.data?.length);

  if (!statisticalResponse || isEmptyResponse) {
    return <p className="text text--warning">Error: NO DATA!</p>;
  }

  if (statisticalResponse.status === 'FAILED' || !isValidStatApiResponse) {
    return (
      <div className="flex flex-col">
        <p className="text text--warning mb-2 font-bold underline">Something went wrong!</p>
        <p className="text mb-2 font-bold">Repsonse:</p>
        <pre className="border border-primary p-2 rounded-md max-h-96 overflow-y-scroll">
          {JSON.stringify(statisticalResponse, null, 2)}
        </pre>
      </div>
    );
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
