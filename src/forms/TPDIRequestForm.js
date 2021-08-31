import React, { useEffect, useState } from 'react';
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

// Components needed to do TPDI Requests:
// Timerange + AOI
// TPDI Related options and actions
const TPDIRequestForm = () => {
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
  }, []);
  return (
    <div>
      <div className="tpdi-first-row">
        <div className="tpdi-first-row-first-item">
          <TPDITimerange />
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
          <TPDIOrderOptions
            setCreateQueryResponse={setCreateQueryResponse}
            setCreateProductsResponse={setCreateProductsResponse}
            afterOrderCreationAction={afterOrderCreationAction}
            amountOfFoundProducts={featuresWithProvider.features.length}
          />
        </div>
        <div className="tpdi-third-row-second-item">
          <TPDIOrdersContainer
            setGetOrdersResponse={setGetOrdersResponse}
            orders={orders}
            setOrders={setOrders}
          />
        </div>
        <div className="tpdi-third-row-third-item">
          <TPDIOrderRequestPreview
            getOrdersResponse={getOrdersResponse}
            createQueryResponse={createQueryResponse}
            createProductsResponse={createProductsResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default TPDIRequestForm;
