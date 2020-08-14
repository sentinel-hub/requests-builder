import React from 'react';
import TPDISourcesAndOptions from '../tpdi/TPDISources';
import TimeRangeSelect from '../input/TimeRangeSelect';
import MapContainer from '../input/MapContainer';
import TPDIOrderOptions from '../tpdi/TPDIOrderOptions';
import TPDIRequestPreview from '../tpdi/TPDIRequestPreview';
import QuotaContainer from '../tpdi/QuotaContainer';
import SearchResultsContainer from '../tpdi/SearchResultsContainer';
import TPDIOrdersContainer from '../tpdi/TPDIOrdersContainer';

// Components needed to do TPDI Requests:
// Timerange + AOI
// TPDI Related options and actions
const TPDIRequestForm = () => {
  return (
    <div>
      <div className="tpdi-first-row">
        <div className="tpdi-first-row-first-item">
          <TimeRangeSelect />
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
