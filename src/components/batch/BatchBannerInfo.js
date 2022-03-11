import React from 'react';
import { connect } from 'react-redux';

const BatchBannerInfo = ({ accountType }) => {
  if (!accountType || accountType < 14000) {
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
  }
  return null;
};

const mapStateToProps = (state) => ({
  accountType: state.auth.user.userdata?.d['1']?.t,
});
export default connect(mapStateToProps)(BatchBannerInfo);
