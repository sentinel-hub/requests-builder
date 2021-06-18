import store from '../../../store';
import requestSlice from '../../../store/request';
import tpdiSlice, { airbusSlice, planetSlice } from '../../../store/tpdi';
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

const dispatchTimerange = (timeRange) => {
  if (timeRange && timeRange.from && timeRange.to) {
    store.dispatch(requestSlice.actions.setTimeFrom({ idx: 0, timeFrom: timeRange.from }));
    store.dispatch(requestSlice.actions.setTimeTo({ idx: 0, timeTo: timeRange.to }));
  }
};
export const parseTPDIRequest = (order) => {
  store.dispatch(tpdiSlice.actions.setTpdiParsing(true));
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
  } else {
    store.dispatch(tpdiSlice.actions.setProvider('PLANET'));
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
  }
};

export const parseSearchRequest = (parsedRequest) => {
  const { provider, bounds, data, planetApiKey } = parsedRequest;
  const { constellation, dataFilter } = data[0];
  const { timeRange } = dataFilter;
  if (provider === 'AIRBUS') {
    const stateConstellation = constellationToStateConstellation[constellation];
    if (stateConstellation) {
      store.dispatch(tpdiSlice.actions.setProvider(stateConstellation));
    }
    const dataFilterOptions = omit(dataFilter, ['timeRange']);
    store.dispatch(airbusSlice.actions.setDataFilterOptions({ ...dataFilterOptions }));
  } else {
    store.dispatch(tpdiSlice.actions.setProvider('PLANET'));
    if (planetApiKey) {
      store.dispatch(planetSlice.actions.setApiKey(planetApiKey));
    }
    if (dataFilter.maxCloudCoverage) {
      store.dispatch(planetSlice.actions.setMaxCloudCoverage(dataFilter.maxCloudCoverage));
    }
  }

  dispatchBounds(bounds);
  dispatchTimerange(timeRange);
};
