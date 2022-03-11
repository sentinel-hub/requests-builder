import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import InstanceSelector from '../components/wms/InstanceSelector';
import LayerSelector from '../components/wms/LayerSelector';
import WmsRequestPreview from '../components/wms/WmsRequestPreview';
import MapContainer from '../components/common/Map/MapContainer';
import Output from '../components/common/Output';
import WmsModeSelector from '../components/wms/WmsModeSelector';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import RunningRequestIndicator from '../components/common/RunningRequestIndicator';
import { ogcAnalyticsPage } from '../utils/initAnalytics';
import WfsAdvancedOptions from '../components/wms/WfsAdvancedOptions';
import WmtsAdvancedOptions from '../components/wms/WmtsAdvancedOptions';

const WMSRequestForm = ({ wmsMode }) => {
  useEffect(() => {
    ogcAnalyticsPage();
  }, []);

  const advancedOptions = useMemo(() => {
    if (wmsMode === 'WFS') {
      return <WfsAdvancedOptions />;
    }
    if (wmsMode === 'WMTS') {
      return <WmtsAdvancedOptions />;
    }
    return null;
  }, [wmsMode]);

  return (
    <div className="wms-request-form">
      <div className="info-banner w-full mb-2">
        FIS mode is starting to enter the deprecation phase, thus not available in the app. We encourage
        everyone to use Statistical API.
      </div>
      <div>
        <WmsModeSelector />
      </div>
      <div className="wms-request-form-first-row">
        <div className="wms-request-form-first-row-first-item">
          <h2 className="heading-secondary">Instance Options</h2>
          <div className="form">
            <InstanceSelector />
            <LayerSelector />
            {advancedOptions}
          </div>
        </div>
        <div className="wms-request-form-first-row-second-item">
          <TimeRangeContainer />
          <div className="output mt-2">{wmsMode !== 'WFS' && <Output />}</div>
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

const mapStateToProps = (state) => ({
  wmsMode: state.wms.mode,
});

export default connect(mapStateToProps)(WMSRequestForm);
