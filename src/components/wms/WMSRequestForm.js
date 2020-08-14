import React from 'react';
import InstanceSelector from './InstanceSelector';
import LayerSelector from './LayerSelector';
import WmsRequestPreview from './WmsRequestPreview';
import TimeRangeSelect from '../input/TimeRangeSelect';
import MapContainer from '../input/MapContainer';
import Output from '../output/Output';
import WmsModeSelector from './WmsModeSelector';
import OGCAdvancedOptions from './OGCAdvancedOptions';

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
          <TimeRangeSelect />
          <div className="output u-margin-top-small">
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
    </div>
  );
};

export default WMSRequestForm;
