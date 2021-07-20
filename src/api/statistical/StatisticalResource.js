import Api from '..';

const { POST } = Api;

const StatisticalResource = {
  statisticalRequest: (url) => POST(url, undefined, undefined, true),
};

export default StatisticalResource;
