const isProd = process.env.NODE_ENV === 'production';

const sendEvent = (eventTag) => {
  if (isProd) {
    window.fathom?.trackGoal(eventTag, 0);
  }
};

export const processAnalyticsPage = () => sendEvent('3RE42IRF');
export const batchAnalyticsPage = () => sendEvent('5XPGDVIP');
export const tpdiAnalyticsPage = () => sendEvent('7UT4YGPH');
export const catalogAnalyticsPage = () => sendEvent('W5YJ1FRW');
export const statisticsAnalyticsPage = () => sendEvent('UYBFZG0F');
export const ogcAnalyticsPage = () => sendEvent('XH3YVDHM');

export const successfulProcessReqEvent = () => sendEvent('FYN6I22R');
export const successfulBatchCreationEvent = () => sendEvent('AVZBAQBR');
export const successfulTpdiCreationEvent = () => sendEvent('ACHFCGHV');
export const successfulCatalogReqEvent = () => sendEvent('ADW1KINA');
export const successfulStatReqEvent = () => sendEvent('NNPWIHJY');
export const successfulOgcReqEvent = () => sendEvent('EJAJCA0F');
