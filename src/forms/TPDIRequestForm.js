import React from 'react';
import TPDISourcesAndOptions from '../components/tpdi/TPDISources';
import MapContainer from '../components/common/Map/MapContainer';
import TPDIOrderOptions from '../components/tpdi/TPDIOrderOptions';
import TPDIRequestPreview from '../components/tpdi/TPDIRequestPreview';
import QuotaContainer from '../components/tpdi/QuotaContainer';
import SearchResultsContainer from '../components/tpdi/SearchResultsContainer';
import TPDIOrdersContainer from '../components/tpdi/TPDIOrdersContainer';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';

// Components needed to do TPDI Requests:
// Timerange + AOI
// TPDI Related options and actions
const TPDIRequestForm = () => {
  return (
    <div>
      <div className="tpdi-first-row">
        <div className="tpdi-first-row-first-item">
          <TimeRangeContainer />
        </div>
        <div className="tpdi-first-row-second-item">
          <MapContainer />
        </div>
      </div>
      <div className="tpdi-second-row">
        <div className="tpdi-second-row-first-item">
          <TPDISourcesAndOptions />
        </div>
        <div className="tpdi-second-row-second-item">
          <TPDIOrderOptions />
        </div>
        <div className="tpdi-second-row-third-item">
          <QuotaContainer />
          <SearchResultsContainer />
          <TPDIOrdersContainer />
        </div>
      </div>
      <div className="tpdi-third-row">
        <div className="tpdi-third-row-first-item">
          <TPDIRequestPreview />
        </div>
      </div>
    </div>
  );
};

export default TPDIRequestForm;
