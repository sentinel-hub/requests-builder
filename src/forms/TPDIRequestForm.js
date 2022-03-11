import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMiddleware, removeMiddleware } from 'redux-dynamic-middlewares';

import TPDISourcesAndOptions from '../components/tpdi/TPDISearchOptions';
import MapContainer from '../components/common/Map/MapContainer';
import TPDIOrderOptions from '../components/tpdi/TPDIOrderOptions';
import TPDIOrderRequestPreview from '../components/tpdi/TPDIOrderRequestPreview';
import QuotaContainer from '../components/tpdi/QuotaContainer';
import SearchResultsContainer from '../components/tpdi/SearchResultsContainer';
import TPDIOrdersContainer from '../components/tpdi/TPDIOrdersContainer';
import TPDITimerange from '../components/tpdi/TPDITimerange';
import TPDISearchRequestPreview from '../components/tpdi/TPDISearchRequestPreview';
import store from '../store';
import alertSlice from '../store/alert';
import TpdiForbiddenMultiPolygon from '../components/tpdi/TpdiForbiddenMultiPolygon';
import { tpdiAnalyticsPage } from '../utils/initAnalytics';
import { tpdiGeometryModalMiddleware } from '../store/middleware';
import RadioSelector from '../components/common/RadioSelector';
import TpdiSubscriptionOptions from '../components/tpdi/TpdiSubscriptionOptions';
import TpdiSubscriptionsContainer from '../components/tpdi/TpdiSubscriptionsContainer';
import TpdiSubscriptionRequestPreview from '../components/tpdi/TpdiSubscriptionRequestPreview';
import tpdiSlice, { planetSlice } from '../store/tpdi';
import Tooltip from '../components/common/Tooltip/Tooltip';
import { useFetchAllPaginatedData } from '../utils/hooks';
import TpdiResource from '../api/tpdi/TpdiResource';

// Components needed to do TPDI Requests:
// Timerange + AOI
// TPDI Related options and actions

export const ORDERS_MODE = 'ORDERS';
export const SUBSCRIPTIONS_MODE = 'SUBSCRIPTIONS';

const TPDIRequestForm = ({ tpdiMode }) => {
  const [searchResponse, setSearchResponse] = useState();
  const [createQueryResponse, setCreateQueryResponse] = useState();
  const [createProductsResponse, setCreateProductsResponse] = useState();
  const [getOrdersResponse, setGetOrdersResponse] = useState();
  // Search results.
  const [featuresWithProvider, setFeaturesWithProvider] = useState({
    provider: '',
    features: [],
  });
  const [orders, setOrders] = useState([]);

  const {
    data: subscriptions,
    error: subscriptionsError,
    isFetching: isFetchingSubscriptions,
    fetchAll: fetchSubscriptions,
    setData: setSubscriptions,
  } = useFetchAllPaginatedData(
    ({ viewtoken }) =>
      TpdiResource.getSubscriptions(
        { viewtoken },
        {
          params: {
            deleted: false,
          },
        },
      ),
    { flat: true },
  );
  const {
    data: deletedSubscriptions,
    error: deletedSubscriptionsError,
    isFetching: isFetchingDeletedSubscriptions,
    fetchAll: fetchDeletedSubscriptions,
    setData: setDeletedSubscriptions,
  } = useFetchAllPaginatedData(
    ({ viewtoken }) =>
      TpdiResource.getSubscriptions(
        { viewtoken },
        {
          params: {
            deleted: true,
          },
        },
      ),
    { flat: true },
  );

  const afterOrderCreationAction = (newOrder) => {
    const newExpandedOrder = { ...newOrder, isExpanded: true };
    setOrders((orders) => [newExpandedOrder, ...orders.map((ord) => ({ ...ord, isExpanded: false }))]);
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'SUCCESS',
        text: 'Order successfully placed. Confirm the order to proceed.',
      }),
    );
  };
  useEffect(() => {
    tpdiAnalyticsPage();
    addMiddleware(tpdiGeometryModalMiddleware);
    return () => {
      removeMiddleware(tpdiGeometryModalMiddleware);
    };
  }, []);
  const handleTpdiModeChange = (e) => {
    store.dispatch(tpdiSlice.actions.setTpdiMode(e.target.value));
    store.dispatch(tpdiSlice.actions.setProvider('PLANET'));
    store.dispatch(planetSlice.actions.setHarmonizeTo('NONE'));
    store.dispatch(planetSlice.actions.setProductBundle('analytic_sr_udm2'));
  };
  return (
    <div>
      <div className="flex ml-2 my-3 items-center">
        <label className="form__label">TPDI Mode</label>
        <RadioSelector
          options={[
            {
              name: 'Orders',
              value: ORDERS_MODE,
            },
            {
              name: 'Subscriptions',
              value: SUBSCRIPTIONS_MODE,
            },
          ]}
          containerClassName="mb-2 ml-2"
          value={tpdiMode}
          onChange={handleTpdiModeChange}
        />
        <Tooltip
          content="For PlanetScope data, we also offer an option to subscribe to all data that matches your criteria. This allows you to subscribe to you area of interest and SH will automatically import all, past and future, PlanetScope data for this AOI."
          direction="right"
        />
      </div>
      <div className="tpdi-first-row">
        <div className="tpdi-first-row-first-item">
          <TPDITimerange tpdiMode={tpdiMode} />
          <QuotaContainer />
        </div>
        <div className="tpdi-first-row-second-item">
          <MapContainer ExtraHeaderComponents={TpdiForbiddenMultiPolygon} />
        </div>
      </div>
      <div className="tpdi-second-row">
        <div className="tpdi-second-row-first-item">
          <TPDISourcesAndOptions
            setFeaturesWithProvider={setFeaturesWithProvider}
            setSearchResponse={setSearchResponse}
          />
        </div>
        <div className="tpdi-second-row-second-item">
          <SearchResultsContainer featuresWithProvider={featuresWithProvider} />
        </div>
        <div className="tpdi-second-row-third-item">
          <TPDISearchRequestPreview searchResponse={searchResponse} />
        </div>
      </div>
      <div className="tpdi-third-row">
        <div className="tpdi-third-row-first-item">
          {tpdiMode === ORDERS_MODE ? (
            <TPDIOrderOptions
              setCreateQueryResponse={setCreateQueryResponse}
              setCreateProductsResponse={setCreateProductsResponse}
              afterOrderCreationAction={afterOrderCreationAction}
              amountOfFoundProducts={featuresWithProvider.features.length}
            />
          ) : (
            <TpdiSubscriptionOptions setSubscriptions={setSubscriptions} />
          )}
        </div>
        <div className="tpdi-third-row-second-item">
          {tpdiMode === ORDERS_MODE ? (
            <TPDIOrdersContainer
              setGetOrdersResponse={setGetOrdersResponse}
              orders={orders}
              setOrders={setOrders}
            />
          ) : (
            <TpdiSubscriptionsContainer
              fetchSubscriptions={fetchSubscriptions}
              fetchDeletedSubscriptions={fetchDeletedSubscriptions}
              subscriptions={subscriptions}
              deletedSubscriptions={deletedSubscriptions}
              isFetchingSubscriptions={isFetchingSubscriptions || isFetchingDeletedSubscriptions}
              setSubscriptions={setSubscriptions}
              subscriptionsError={subscriptionsError || deletedSubscriptionsError}
              setDeletedSubscriptions={setDeletedSubscriptions}
            />
          )}
        </div>
        <div className="tpdi-third-row-third-item">
          {tpdiMode === ORDERS_MODE ? (
            <TPDIOrderRequestPreview
              getOrdersResponse={getOrdersResponse}
              createQueryResponse={createQueryResponse}
              createProductsResponse={createProductsResponse}
            />
          ) : (
            <TpdiSubscriptionRequestPreview />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tpdiMode: state.tpdi.mode,
});

export default connect(mapStateToProps)(TPDIRequestForm);
