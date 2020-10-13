import store, { tpdiSlice, requestSlice, airbusSlice, planetSlice } from '../../../store';
import { transformGeometryToWGS84IfNeeded } from '../../common/Map/utils/crsTransform';
import omit from 'lodash.omit';
import { crsUrlToCrsKey } from '../../../utils/const';

export const parseTPDIRequest = (order) => {
  const { name, provider, input, collectionId } = order;
  //name
  store.dispatch(tpdiSlice.actions.setName(name));
  //provider
  store.dispatch(tpdiSlice.actions.setProvider(provider));
  //collectionID
  if (collectionId) {
    store.dispatch(tpdiSlice.actions.setCollectionId(collectionId));
  }

  const { bounds, data } = input;

  //geometry
  if (bounds.bbox) {
    let bbox = bounds.bbox;
    if (bounds.properties && bounds.properties.crs) {
      bbox = transformGeometryToWGS84IfNeeded(crsUrlToCrsKey(bounds.properties.crs), bounds.bbox);
    }
    store.dispatch(requestSlice.actions.setGeometry(bbox));
  } else if (bounds.geometry) {
    let geometry = bounds.geometry;
    if (bounds.properties && bounds.properties.crs) {
      geometry = transformGeometryToWGS84IfNeeded(crsUrlToCrsKey(bounds.properties.crs), bounds.geometry);
    }
    store.dispatch(requestSlice.actions.setGeometry(geometry));
  }

  // timerange.
  const timeRange = data[0].dataFilter ? data[0].dataFilter.timeRange : undefined;
  if (timeRange && timeRange.from && timeRange.to) {
    store.dispatch(requestSlice.actions.setTimeFrom({ idx: 0, timeFrom: timeRange.from }));
    store.dispatch(requestSlice.actions.setTimeTo({ idx: 0, timeTo: timeRange.to }));
  }

  // dependant on provider.
  if (provider === 'AIRBUS') {
    //datafilter options
    const dataFilterOptions = omit(data[0].dataFilter, ['timeRange']);
    store.dispatch(airbusSlice.actions.setDataFilterOptions({ dataFilterOptions }));
    // products
    if (data[0].products && data[0].products.length > 0) {
      const products = data[0].products.map((prod) => prod.id);
      store.dispatch(tpdiSlice.actions.setProducts(products));
    }
  } else if (provider === 'PLANET') {
    //products
    const products = data[0].itemIds;
    if (products) {
      store.dispatch(tpdiSlice.actions.setProducts(products));
    }
    if (order.planetApiKey) {
      store.dispatch(planetSlice.actions.setApiKey(order.planetApiKey));
    }
    const planetCC = data[0].dataFilter.maxCloudCoverage;
    if (planetCC) {
      store.dispatch(planetSlice.actions.setMaxCloudCoverage(planetCC));
    }
  }
};
