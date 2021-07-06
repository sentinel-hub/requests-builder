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
    dispatchChanges(JSON.parse(wmsLayerToProcessRequest(wmsState.layer, requestState, mapState)), true);
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
          value: wmsState.layer.otherDefaults
            ? () => wmsLayerToProcessRequest(wmsState.layer, requestState, mapState)
            : "Select a personal layer to see it's process request",
          nonToggle: true,
        },
        {
          name: 'PROCESS - Curl',
          value: wmsState.layer.otherDefaults
            ? () => wmsLayerToCurl(wmsState.layer, requestState, mapState, token)
            : "Select a personal layer to see it's process request",
          nonToggle: true,
        },
      ];
    } else {
      return [
        {
          name: 'Ogc Request',
          value: url,
          nonToggle: true,
        },
      ];
    }
  };

  return (
    <>
      <h2 className="heading-secondary mb-2">Request Preview (URL)</h2>
      <div className="form">
        <CommonRequestPreview
          options={generateRequestPreviewOptions()}
          canCopy
          className="process-editor"
          id="wms-request-preview"
          additionalCodeMirrorOptions={{ lineWrapping: true }}
        />
        {wmsState.layer.id && mode === 'WMS' && (
          <button className="secondary-button w-fit" onClick={handleSeeOnProcess}>
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
