import React from 'react';

const BatchBannerInfo = () => {
  return (
    <div className="info-banner mb-2 mr-2">
      <p>
        Batch processing is only available using an Enterprise Account. You can check about the pricing{' '}
        <a href="https://www.sentinel-hub.com/pricing/" rel="noopener noreferrer" target={'_blank'}>
          here.
        </a>
      </p>
    </div>
  );
};

export default BatchBannerInfo;
