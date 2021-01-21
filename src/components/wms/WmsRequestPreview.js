import React from 'react';
import { getWmsUrl, getFisUrl, getWcsUrl } from './wmsRequests';
import { connect } from 'react-redux';

const WmsRequestPreview = ({ wmsState, requestState, mode }) => {
  const url = (() => {
    switch (mode) {
      case 'WMS':
        return getWmsUrl(wmsState, requestState);
      case 'FIS':
        return getFisUrl(wmsState, requestState);
      case 'WCS':
        return getWcsUrl(wmsState, requestState);
      default:
        return getWmsUrl(wmsState, requestState);
    }
  })();

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-small">Request Preview (URL)</h2>
      <div className="form">
        <textarea className="textarea" value={url} readOnly />
        <button style={{ width: 'fit-content' }} className="secondary-button" onClick={handleClipboardCopy}>
          Copy
        </button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  wmsState: state.wms,
  requestState: state.request,
  mode: state.wms.mode,
});

export default connect(mapStateToProps)(WmsRequestPreview);
