import { getStatisticalCalculations } from '../../../api/statistical/utils';
import { isEmpty } from '../../../utils/commonUtils';
import { isPolygon } from '../../common/Map/utils/geoUtils';
import {
  datasourceToSHPYDatasource,
  getDimensionsSHPY,
  getSHPYAdvancedOptions,
  getSHPYBounds,
  getSHPYCredentials,
} from '../../process/lib/generateShPyRequest';

const shPyStatImports = `from sentinelhub import SHConfig, SentinelHubStatistical, BBox, Geometry, DataCollection, CRS`;

const getInputs = (dataCollections, dataFilterOptions, processingOptions) => {
  const reqState = {
    dataFilterOptions,
  };
  const isOnDatafusion = dataCollections.length > 1;
  return dataCollections.reduce((acc, dataCollection, idx) => {
    const advancedOptions = getSHPYAdvancedOptions(
      { dataCollections, dataFilterOptions, processingOptions },
      idx,
    );
    acc += `${idx > 0 ? '\n        ' : ''}SentinelHubStatistical.input_data(
            ${datasourceToSHPYDatasource(dataCollection, reqState)},\
            ${advancedOptions ? `\n            ${advancedOptions},` : ''}\
            ${isOnDatafusion ? `\n            identifier='${dataCollection.id}'` : ''}
      ),`;
    return acc;
  }, '');
};

const checkIfEmptyCalculations = (calculationsObj) => {
  for (let cKey of Object.keys(calculationsObj)) {
    if (!isEmpty(calculationsObj[cKey])) {
      return false;
    }
  }
  return true;
};

const getAggregationOtherArgs = (lastIntervalBehavior) => {
  if (lastIntervalBehavior !== '') {
    return `\n        other_args={ "lastIntervalBehavior": "${lastIntervalBehavior}" }`;
  }
  return '';
};

const getStatisticalShPyRequest = (
  dataCollections,
  dataFilterOptions,
  processingOptions,
  bounds,
  dimensions,
  evalscript,
  timeRange,
  statisticalState,
) => {
  const calculations = getStatisticalCalculations(statisticalState);
  const areCalculationsEmpty = checkIfEmptyCalculations(calculations.calculations);
  return `${shPyStatImports}
${getSHPYCredentials()}

evalscript = """
${evalscript}
"""
${!areCalculationsEmpty ? `\ncalculations = ${JSON.stringify(calculations.calculations, null, 4)}\n` : ''}
${getSHPYBounds(bounds)}
request = SentinelHubStatistical(
    aggregation=SentinelHubStatistical.aggregation(
        evalscript=evalscript,
        time_interval=('${timeRange.timeFrom}', '${timeRange.timeTo}'),
        aggregation_interval='${statisticalState.aggregationInterval}',
        ${getDimensionsSHPY(dimensions)}\
        ${getAggregationOtherArgs(statisticalState.lastIntervalBehavior)}
    ),
    input_data=[
        ${getInputs(dataCollections, dataFilterOptions, processingOptions)}
    ],
    bbox=bbox,\
${isPolygon(bounds.convertedGeometry) ? `\n    geometry=geometry,` : ''}\
${!areCalculationsEmpty ? `\n    calculations=calculations,` : ''}
    config=config
)

response = request.get_data()
`;
};

export default getStatisticalShPyRequest;
