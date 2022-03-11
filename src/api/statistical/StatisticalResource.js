import Api from '..';

const { POST } = Api;

const StatisticalResource = {
  statisticalRequest: (url) => POST(url, { isFullUrl: true }),
};

export default StatisticalResource;
