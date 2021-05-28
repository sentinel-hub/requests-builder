import Api from '..';

export const STATISTICAL_BASE_URL = 'https://services.sentinel-hub.com/api/v1/statistics';

const { POST } = Api;

const StatisticalResource = {
  statisticalRequest: POST(STATISTICAL_BASE_URL),
};

export default StatisticalResource;
