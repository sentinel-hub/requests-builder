import React from 'react';
import { getWmsUrl, getFisUrl } from './wmsRequests';
import { connect } from 'react-redux';

const WmsRequestPreview = ({ wmsState, requestState, mode }) => {
  const url = mode === 'WMS' ? getWmsUrl(wmsState, requestState) : getFisUrl(wmsState, requestState);

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
