import store from '../../../store';
import requestSlice from '../../../store/request';
import tpdiSlice, { airbusSlice, maxarSlice, planetSlice } from '../../../store/tpdi';
import omit from 'lodash.omit';
import { constellationToStateConstellation } from '../utils';
import mapSlice from '../../../store/map';
import { crsUrlToCrsKey } from '../../../utils/const/constMap';

const dispatchBounds = (bounds) => {
  if (bounds.bbox) {
    const bbox = bounds.bbox;
    store.dispatch(
      mapSlice.actions.setConvertedGeometryWithCrs({
        crs: bounds.properties?.crs ? crsUrlToCrsKey(bounds.properties.crs) : undefined,
        geometry: bbox,
      }),
    );
  } else if (bounds.geometry) {
    const geometry = bounds.geometry;
    store.dispatch(
      mapSlice.actions.setConvertedGeometryWithCrs({
        crs: bounds.properties?.crs ? crsUrlToCrsKey(bounds.properties.crs) : undefined,
        geometry,
      }),
    );
  }
};

const parseMaxarOptions = (dataObj) => {
  const { productKernel } = dataObj;
  if (productKernel) {
    store.dispatch(maxarSlice.actions.setProductKernel(productKernel));
  }
  if (dataObj?.dataFilter) {
    const {
      maxCloudCoverage,
      minOffNadir,
      maxOffNadir,
      minSunElevation,
      maxSunElevation,
      sensor,
    } = dataObj.dataFilter;
    if (maxCloudCoverage) {
      store.dispatch(
        maxarSlice.actions.setMaxarDataFilterParam({ key: 'maxCloudCoverage', value: maxCloudCoverage }),
      );
    }
    if (minOffNadir) {
      store.dispatch(maxarSlice.actions.setMaxarDataFilterParam({ key: 'minOffNadir', value: minOffNadir }));
    }
    if (maxOffNadir) {
      store.dispatch(maxarSlice.actions.setMaxarDataFilterParam({ key: 'maxOffNadir', value: maxOffNadir }));
    }
    if (minSunElevation) {
      store.dispatch(
        maxarSlice.actions.setMaxarDataFilterParam({ key: 'minSunElevation', value: minSunElevation }),
      );
    }
    if (maxSunElevation) {
      store.dispatch(
        maxarSlice.actions.setMaxarDataFilterParam({ key: 'maxSunElevation', value: maxSunElevation }),
      );
    }
    if (sensor) {
      store.dispatch(maxarSlice.actions.setMaxarDataFilterParam({ key: 'sensor', value: sensor }));
    }
  }
};

const dispatchTimerange = (timeRange) => {
  if (timeRange && timeRange.from && timeRange.to) {
    store.dispatch(requestSlice.actions.setTimeFrom({ idx: 0, timeFrom: timeRange.from }));
    store.dispatch(requestSlice.actions.setTimeTo({ idx: 0, timeTo: timeRange.to }));
  }
};
export const parseTPDIRequest = (order) => {
  const { name, input, collectionId } = order;
  //name
  store.dispatch(tpdiSlice.actions.setName(name));
  //provider
  const { provider } = input;
  if (provider === 'AIRBUS') {
    const constellation = constellationToStateConstellation[input.data[0].constellation];
    if (constellation) {
      store.dispatch(tpdiSlice.actions.setProvider(constellation));
    }
  } else if (provider === 'PLANET') {
    store.dispatch(tpdiSlice.actions.setProvider('PLANET'));
  } else if (provider === 'MAXAR') {
    store.dispatch(tpdiSlice.actions.setProvider('MAXAR'));
  }
  //collectionID
  if (collectionId) {
    store.dispatch(tpdiSlice.actions.setCollectionId(collectionId));
  }

  const { bounds, data } = input;

  //geometry
  dispatchBounds(bounds);
  // timerange.
  const timeRange = data[0].dataFilter ? data[0].dataFilter.timeRange : undefined;
  dispatchTimerange(timeRange);

  // dependant on provider.
  if (provider === 'AIRBUS') {
    //datafilter options
    const dataFilterOptions = omit(data[0].dataFilter, ['timeRange']);
    store.dispatch(airbusSlice.actions.setDataFilterOptions({ ...dataFilterOptions }));
    // products
    if (data[0].products && data[0].products.length > 0) {
      const products = data[0].products.map((prod) => prod.id);
      store.dispatch(tpdiSlice.actions.setProducts(products));
    } else {
      store.dispatch(tpdiSlice.actions.setIsUsingQuery(true));
    }
  } else if (provider === 'PLANET') {
    //products
    const products = data[0].itemIds;
    if (products) {
      store.dispatch(tpdiSlice.actions.setProducts(products));
    } else {
      store.dispatch(tpdiSlice.actions.setIsUsingQuery(true));
    }
    if (order.input.planetApiKey) {
      store.dispatch(planetSlice.actions.setApiKey(order.input.planetApiKey));
    }
    const planetCC = data[0].dataFilter?.maxCloudCoverage;
    if (planetCC) {
      store.dispatch(planetSlice.actions.setMaxCloudCoverage(planetCC));
    }
  } else if (provider === 'MAXAR') {
    // products
    const selectedImages = data[0]?.selectedImages;
    if (selectedImages) {
      store.dispatch(tpdiSlice.actions.setProducts(selectedImages));
    } else {
      store.dispatch(tpdiSlice.actions.setIsUsingQuery(true));
    }
    parseMaxarOptions(data[0] ?? {});
  }
};

export const parseSubscriptionsRequest = (subscription) => {
  const { bounds, data } = subscription;
  const { dataFilter } = data[0];
  const { timeRange } = dataFilter;

  if (dataFilter.maxCloudCoverage) {
    store.dispatch(planetSlice.actions.setMaxCloudCoverage(dataFilter.maxCloudCoverage));
  }
  if (subscription.planetApiKey) {
    store.dispatch(planetSlice.actions.setApiKey(subscription.planetApiKey));
  }
  if (subscription.collectionId) {
    store.dispatch(tpdiSlice.actions.setCollectionId(subscription.collectionId));
  }
  dispatchBounds(bounds);
  dispatchTimerange(timeRange);
};

export const parseSearchRequest = (parsedRequest) => {
  const { provider, bounds, data } = parsedRequest;
  if (!data) {
    return;
  }
  const { constellation, dataFilter } = data[0];
  const { timeRange } = dataFilter;
  if (provider === 'AIRBUS') {
    const stateConstellation = constellationToStateConstellation[constellation];
    if (stateConstellation) {
      store.dispatch(tpdiSlice.actions.setProvider(stateConstellation));
    }
    const dataFilterOptions = omit(dataFilter, ['timeRange']);
    store.dispatch(airbusSlice.actions.setDataFilterOptions({ ...dataFilterOptions }));
  } else if (provider === 'PLANET') {
    store.dispatch(tpdiSlice.actions.setProvider('PLANET'));
    if (dataFilter.maxCloudCoverage) {
      store.dispatch(planetSlice.actions.setMaxCloudCoverage(dataFilter.maxCloudCoverage));
    }
  } else if (provider === 'MAXAR') {
    store.dispatch(tpdiSlice.actions.setProvider('MAXAR'));
    parseMaxarOptions(data[0]);
  }

  dispatchBounds(bounds);
  dispatchTimerange(timeRange);
};
