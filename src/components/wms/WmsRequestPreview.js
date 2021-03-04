import React from 'react';
import { getWmsUrl, getFisUrl, getWcsUrl } from './wmsRequests';
import { connect } from 'react-redux';
import wmsLayerToProcessRequest, { wmsLayerToCurl } from './wmsToProcess';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { dispatchChanges } from '../process/requests/parseRequest';

const WmsRequestPreview = ({ wmsState, requestState, mapState, mode, token }) => {
  const url = (() => {
    switch (mode) {
      case 'WMS':
        return getWmsUrl(wmsState, requestState, mapState);
      case 'FIS':
        return getFisUrl(wmsState, requestState, mapState);
      case 'WCS':
        return getWcsUrl(wmsState, requestState, mapState);
      default:
        return getWmsUrl(wmsState, requestState, mapState);
    }
  })();

  const handleSeeOnProcess = () => {
    dispatchChanges(JSON.parse(wmsLayerToProcessRequest(wmsState.layer, requestState, mapState)));
  };

  const generateRequestPreviewOptions = () => {
    if (mode === 'WMS') {
      return [
        {
          name: 'OGC - GetMap',
          value: url,
          nonToggle: true,
        },
        {
          name: 'PROCESS',
          value: wmsState.layer.id
            ? wmsLayerToProcessRequest(wmsState.layer, requestState, mapState)
            : "Select a layer to see it's process request",
          nonToggle: true,
        },
        {
          name: 'PROCESS - Curl',
          value: wmsState.layer.id
            ? wmsLayerToCurl(wmsState.layer, requestState, mapState, token)
            : "Select a layer to see it's process request",
          nonToggle: true,
        },
      ];
    } else {
      return [
        {
          name: 'OGC - GetMap',
          value: url,
          nonToggle: true,
        },
      ];
    }
  };

  return (
    <>
      <h2 className="heading-secondary u-margin-bottom-small">Request Preview (URL)</h2>
      <div className="form">
        <CommonRequestPreview
          options={generateRequestPreviewOptions()}
          canCopy
          className="process-editor"
          id="wms-request-preview"
          additionalCodeMirrorOptions={{ lineWrapping: true }}
        />
        {wmsState.layer.id && mode === 'WMS' && (
          <button className="secondary-button secondary-button--fit" onClick={handleSeeOnProcess}>
            See on Process Mode
          </button>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  wmsState: state.wms,
  requestState: state.request,
  mode: state.wms.mode,
  mapState: state.map,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(WmsRequestPreview);
