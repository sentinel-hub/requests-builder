import React, { useEffect, useState } from 'react';
import DataSourceSelect from '../components/common/DataSourceSelect';
import EvalscriptEditor from '../components/common/Evalscript/EvalscriptEditor';
import MapContainer from '../components/common/Map/MapContainer';
import RunningRequestIndicator from '../components/common/RunningRequestIndicator';
import TimeRangeContainer from '../components/common/TimeRange/TimeRangeContainer';
import StatisticalCalculations from '../components/statistical/StatisticalCalculations';
import StatisticalOutput from '../components/statistical/StatisticalOutput';
import StatisticalRequestPreview from '../components/statistical/StatisticalRequestPreview';
import { statisticsAnalyticsPage } from '../utils/initAnalytics';

const StatisticalRequestForm = () => {
  const [requestResponse, setRequestResponse] = useState();

  useEffect(() => {
    statisticsAnalyticsPage();
  }, []);
  return (
    <div>
      <div className="statistical-first-row">
        <div className="statistical-first-row-first-item">
          <DataSourceSelect />
        </div>
        <div className="statistical-first-row-second-item">
          <TimeRangeContainer />
          <StatisticalOutput />
        </div>
        <div className="statistical-first-row-third-item">
          <MapContainer />
        </div>
      </div>
      <div className="statistical-second-row">
        <div className="statistical-second-row-first-item">
          <EvalscriptEditor className="statistical-evalscript-editor" />
        </div>
        <div className="statistical-second-row-second-item">
          <StatisticalCalculations />
        </div>
        <div className="statistical-second-row-third-item">
          <StatisticalRequestPreview
            setRequestResponse={setRequestResponse}
            requestResponse={requestResponse}
          />
        </div>
      </div>
      <RunningRequestIndicator />
    </div>
  );
};

export default StatisticalRequestForm;
