import React from 'react';
import { RefreshIcon } from '@heroicons/react/outline';
import store from '../../store';
import mapSlice from '../../store/map';
import { formatNumber } from '../../utils/commonUtils';
import { getTransformedGeometryFromBounds } from '../common/Map/utils/crsTransform';
import { focusMap } from '../common/Map/utils/geoUtils';
import BaseModal from './BaseModal';
import RequestPropsButton from '../common/RequestPropsButton';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { addAlertOnError } from '../batch/lib/utils';
import { getMessageFromApiError } from '../../api';
import SubscriptionsStartButton from './subscriptions/SubscriptionsStartButton';
import SubscriptionsDeleteButton from './subscriptions/SubscriptionsDeleteButton';
import SubscriptionsCancelButton from './subscriptions/SubscriptionsCancelButton';
import SubscriptionDeliveriesModal from './subscriptions/SubscriptionDeliveriesModal';
import { getFormattedDatetime } from './utils';
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/solid';

const TpdiSubscriptionEntry = ({ subscription, setSubscriptions, isLast, isDeleted, handleExpand }) => {
  const displayExtraGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(subscription.input.bounds);
    store.dispatch(mapSlice.actions.setExtraGeometry(transformedGeo));
    focusMap();
  };

  const handleRefresh = async () => {
    try {
      const { data } = await TpdiResource.getSubscription({ subscriptionId: subscription.id });
      setSubscriptions((prev) => {
        const idx = prev.findIndex((sub) => sub.id === subscription.id);
        return prev
          .slice(0, idx)
          .concat(data)
          .concat(prev.slice(idx + 1));
      });
    } catch (err) {
      addAlertOnError(getMessageFromApiError(err));
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div
          className="flex items-center cursor-pointer py-2 mb-1"
          onClick={() => handleExpand(subscription.id, isDeleted)}
        >
          <p className="font-bold mr-2">
            {subscription.name ?? ''}
            {' - '}
          </p>
          <p className="mr-2">{getFormattedDatetime(subscription.created)}</p>
          {subscription.isExpanded ? (
            <ChevronDoubleDownIcon className="w-5" />
          ) : (
            <ChevronDoubleUpIcon className="w-5" />
          )}
        </div>
        {subscription.isExpanded && (
          <div className="flex items-center">
            <div className="pl-3 mt-2 mb-2">
              <p className="text mb-2">
                <b>Id:</b> {subscription.id}
              </p>
              {subscription.name && (
                <p className="text mb-2">
                  <b>Name:</b> {subscription.name}
                </p>
              )}
              {subscription.collectionId && (
                <p className="text mb-2">
                  <b>Collection Id:</b> {subscription.collectionId}
                </p>
              )}
              <p className="text mb-2">
                <b>Status:</b> {subscription.status}
              </p>
              <div className="flex items-center mb-2">
                <b>Geometry:</b>{' '}
                <button className="underline-button ml-2" onClick={displayExtraGeometry}>
                  Display on map
                </button>
              </div>
              <p className="text mb-2">
                <b>
                  Km<sup>2</sup>:
                </b>{' '}
                {formatNumber(subscription.sqkm, 2)}
              </p>
              <div className="flex items-center mb-2">
                <b>Input JSON:</b>{' '}
                <BaseModal
                  trigger={<button className="underline-button ml-2">Display</button>}
                  content={() => (
                    <div className="mx-5 mb-3">
                      <h3 className="heading-secondary mb-2 underline">
                        Subscription <i>{subscription.id}</i>
                        {'  '}input
                      </h3>
                      <pre className="border border-gray-400 p-2 rounded-md">
                        {JSON.stringify(subscription.input, null, 2)}
                      </pre>
                    </div>
                  )}
                />
              </div>
              {subscription.status !== 'CREATED' && (
                <div className="flex">
                  <b>Deliveries:</b>
                  <SubscriptionDeliveriesModal subscriptionId={subscription.id} />
                </div>
              )}
            </div>

            <div>
              <h3 className="heading-secondary text-center mb-2">Actions</h3>
              <div className="grid grid-cols-2 gap-x-2 h-24">
                <SubscriptionsStartButton
                  setSubscriptions={setSubscriptions}
                  subscription={subscription}
                  handleRefresh={handleRefresh}
                />
                <SubscriptionsDeleteButton setSubscriptions={setSubscriptions} subscription={subscription} />
                <SubscriptionsCancelButton
                  setSubscriptions={setSubscriptions}
                  subscription={subscription}
                  handleRefresh={handleRefresh}
                />

                <RequestPropsButton
                  className="secondary-button h-9 flex items-center"
                  content={
                    <>
                      <RefreshIcon className="w-5 mr-1" />
                      Refresh
                    </>
                  }
                  request={handleRefresh}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isLast && (
        <div className="flex w-full justify-center">
          <hr className="border border-primary-dark w-24 text-center my-2 border-dashed" />
        </div>
      )}
    </>
  );
};

export default React.memo(TpdiSubscriptionEntry);
