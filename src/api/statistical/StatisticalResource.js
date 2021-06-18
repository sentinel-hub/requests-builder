import Api from '..';

const { POST } = Api;

const StatisticalResource = {
  statisticalRequest: (url) => POST(url + '/statistics'),
};

export default StatisticalResource;
