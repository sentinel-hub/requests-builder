const isProd = process.env.NODE_ENV === 'production';

const analyticsPage = (page) => () => {
  if (isProd) {
    window.gtag('event', 'page_view', { page_title: page });
  }
};

const sendEvent = (eventName, options) => {
  if (isProd) {
    window.gtag('event', eventName, options);
  }
};

export function sendToGoogleAnalytics({ name, delta, value, id }) {
  if (isProd) {
    window.gtag('event', name, {
      value: delta,
      metric_id: id, // Needed to aggregate events.
      metric_value: value, // Optional.
      metric_delta: delta, // Optional.
    });
  }
}

export const processAnalyticsPage = analyticsPage('process');
export const batchAnalyticsPage = analyticsPage('batch');
export const tpdiAnalyticsPage = analyticsPage('tpdi');
export const catalogAnalyticsPage = analyticsPage('catalog');
export const statisticsAnalyticsPage = analyticsPage('stat-api');
export const ogcAnalyticsPage = analyticsPage('ogc');

// Events

export const loginEvent = () => sendEvent('login');
export const logoutEvent = () => sendEvent('logout');
export const successfulProcessReqEvent = () => sendEvent('process_request', { status: 'success' });
export const errorProcessReqEvent = () => sendEvent('process_request', { status: 'failure' });
export const successfulBatchCreationEvent = () => sendEvent('create_batch_request', { status: 'success' });
export const errorBatchCreationEvent = () => sendEvent('create_batch_request', { status: 'failure' });
export const successfulTpdiCreationEvent = () => sendEvent('create_tpdi_order', { status: 'success' });
export const errorTpdiCreationEvent = () => sendEvent('create_tpdi_order', { status: 'failure' });
export const successfulCatalogReqEvent = () => sendEvent('catalog_request', { status: 'success' });
export const errorCatalogReqEvent = () => sendEvent('catalog_request', { status: 'failure' });
export const successfulStatReqEvent = () => sendEvent('statapi_request', { status: 'success' });
export const errorStatReqEvent = () => sendEvent('statapi_request', { status: 'failure' });
export const successfulOgcReqEvent = (label) =>
  sendEvent('ogc_request', { status: 'success', ogcService: label });
export const errorOgcReqEvent = (label) => sendEvent('ogc_request', { status: 'failure', ogcService: label });
