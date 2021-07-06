import React from 'react';
import InstanceSelector from '../components/wms/InstanceSelector';
import LayerSelector from '../components/wms/LayerSelector';
import WmsRequestPreview from '../components/wms/WmsRequestPreview';
import MapContainer from '../components/common/Map/MapContainer';
import Output from '../components/common/Output';
import WmsModeSelector from '../components/wms/WmsModeSelector';
import OGCAdvancedOptions from '../components/wms/OGCAdvancedOptions';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import RunningRequestIndicator from '../components/common/RunningRequestIndicator';

const WMSRequestForm = () => {
  return (
    <div className="wms-request-form">
      <div>
        <WmsModeSelector />
      </div>
      <div className="wms-request-form-first-row">
        <div className="wms-request-form-first-row-first-item">
          <h2 className="heading-secondary">Instance Options</h2>
          <div className="form">
            <InstanceSelector />
            <LayerSelector />
            <OGCAdvancedOptions />
          </div>
        </div>
        <div className="wms-request-form-first-row-second-item">
          <TimeRangeContainer />
          <div className="output mt-2">
            <Output />
          </div>
        </div>
        <div className="wms-request-form-first-row-third-item">
          <MapContainer />
        </div>
      </div>

      <div className="wms-request-form-second-row">
        <div className="wms-request-form-second-row-first-item">
          <WmsRequestPreview />
        </div>
      </div>
      <RunningRequestIndicator />
    </div>
  );
};

export default WMSRequestForm;
