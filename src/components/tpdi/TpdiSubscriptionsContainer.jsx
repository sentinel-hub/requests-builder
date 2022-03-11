import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';

import { formatNumber, groupBy } from '../../utils/commonUtils';
import { getAreaFromGeometry, getProperGeometry, getUnion } from '../common/Map/utils/geoUtils';
import RequestPropsButton from '../common/RequestPropsButton';
import TpdiSubscriptionEntry from './TpdiSubscriptionEntry';

const subscriptionsGroupAggregator = (el) => {
  if (el.status === 'CANCELLED' || el.status === 'COMPLETED' || el.status === 'FAILED') {
    return 'FINISHED';
  }
  return el.status;
};

const calculateSubscriptionsArea = (subscriptions) => {
  if (subscriptions.length === 0) {
    return 0;
  }

  const unionGeo = subscriptions.slice(1).reduce((acc, sub) => {
    const union = getUnion(acc, getProperGeometry(sub.input.bounds));
    return union ?? acc;
  }, getProperGeometry(subscriptions[0].input.bounds));

  return getAreaFromGeometry(unionGeo);
};

const appendIsExpanded = (subscriptions) =>
  subscriptions.map((sub) => ({ ...sub, isExpanded: sub.isExpanded ?? false }));

const TpdiSubscriptionsContainer = ({
  token,
  subscriptions,
  setSubscriptions,
  fetchSubscriptions,
  isFetchingSubscriptions,
  subscriptionsError,
  deletedSubscriptions,
  fetchDeletedSubscriptions,
  setDeletedSubscriptions,
}) => {
  const { FINISHED, CREATED, RUNNING } = useMemo(
    () => groupBy(appendIsExpanded(subscriptions), subscriptionsGroupAggregator),
    [subscriptions],
  );
  const deletedWithIsExpanded = useMemo(() => appendIsExpanded(deletedSubscriptions), [deletedSubscriptions]);

  const handleFetchSubscriptions = useCallback(async () => {
    await fetchSubscriptions();
    await fetchDeletedSubscriptions();
  }, [fetchSubscriptions, fetchDeletedSubscriptions]);
  const { subscriptionsArea, deletedSubscriptionsArea } = useMemo(() => {
    const subscriptionsArea =
      calculateSubscriptionsArea(
        subscriptions.filter((sub) => sub.status !== 'CREATED' && sub.status !== 'FAILED'),
      ) / 1e6;
    const deletedSubscriptionsArea = calculateSubscriptionsArea(deletedSubscriptions) / 1e6;
    return { subscriptionsArea, deletedSubscriptionsArea };
  }, [subscriptions, deletedSubscriptions]);

  const handleExpand = useCallback(
    (subId, isDeleted) => {
      const set = (prev) => {
        const idx = prev.findIndex((sub) => sub.id === subId);
        const toUpdate = prev[idx];
        return prev
          .slice(0, idx)
          .concat([{ ...toUpdate, isExpanded: !toUpdate.isExpanded }, ...prev.slice(idx + 1)]);
      };
      if (isDeleted) {
        setDeletedSubscriptions((prev) => set(prev));
      } else {
        setSubscriptions((prev) => set(prev));
      }
    },
    [setDeletedSubscriptions, setSubscriptions],
  );
  return (
    <>
      <h2 className="heading-secondary">My Subscriptions</h2>
      <div className="form overflow-y-scroll" style={{ height: '620px' }}>
        <div className="flex items-center mb-3">
          <RequestPropsButton
            content="Fetch Subscriptions"
            request={handleFetchSubscriptions}
            isFetching={isFetchingSubscriptions}
            className="w-44"
            disabled={!Boolean(token)}
          />
          {subscriptionsArea > 0 && (
            <p className="ml-2">
              {formatNumber(subscriptionsArea, 2)}km<sup>2</sup> of confirmed area.{' '}
              {deletedSubscriptionsArea > 0 && (
                <span>
                  ({formatNumber(deletedSubscriptionsArea, 2)}km<sup>2</sup> on deleted subscriptions
                </span>
              )}
            </p>
          )}
        </div>
        <hr className="border-2 mb-2 border-primary-dark" />

        {subscriptionsError ? (
          <p>
            Something went wrong while fetching subscriptions: <br />
            {subscriptionsError}
          </p>
        ) : isFetchingSubscriptions ? (
          <p>Fetching subscriptions...</p>
        ) : (
          <>
            <h3 className="heading-secondary">Created Subscriptions (Not confirmed)</h3>
            {CREATED === undefined || CREATED.length === 0 ? (
              <p className="text mb-3 ml-2 mt-2">No subscriptions found</p>
            ) : (
              CREATED.map((subscription, idx) => (
                <TpdiSubscriptionEntry
                  key={subscription.id}
                  subscription={subscription}
                  setSubscriptions={setSubscriptions}
                  isLast={idx === CREATED.length - 1}
                  handleExpand={handleExpand}
                />
              ))
            )}
            <hr className="border-2 border-primary-dark mb-3" />
            <h3 className="heading-secondary">Running Subscriptions</h3>
            {RUNNING === undefined || RUNNING.length === 0 ? (
              <p className="text mb-3 ml-2 mt-2">No subscriptions found</p>
            ) : (
              RUNNING.map((subscription, idx) => (
                <TpdiSubscriptionEntry
                  key={subscription.id}
                  subscription={subscription}
                  setSubscriptions={setSubscriptions}
                  isLast={idx === RUNNING.length - 1}
                  handleExpand={handleExpand}
                />
              ))
            )}
            <hr className="border-2 border-primary-dark mb-3" />
            <h3 className="heading-secondary">Finished Subscriptions</h3>
            {FINISHED === undefined || FINISHED.length === 0 ? (
              <p className="text mb-3 ml-2 mt-2">No subscriptions found</p>
            ) : (
              FINISHED.map((subscription, idx) => (
                <TpdiSubscriptionEntry
                  key={subscription.id}
                  subscription={subscription}
                  setSubscriptions={setSubscriptions}
                  isLast={idx === FINISHED.length - 1}
                  handleExpand={handleExpand}
                />
              ))
            )}
            <hr className="border-2 border-primary-dark mb-3" />
            <h3 className="heading-secondary">Deleted Subscriptions</h3>
            {deletedWithIsExpanded === undefined || deletedWithIsExpanded.length === 0 ? (
              <p className="text mb-3 ml-2 mt-2">No subscriptions found</p>
            ) : (
              deletedWithIsExpanded.map((subscription, idx) => (
                <TpdiSubscriptionEntry
                  key={subscription.id}
                  subscription={subscription}
                  setSubscriptions={setSubscriptions}
                  isLast={idx === deletedWithIsExpanded.length - 1}
                  isDeleted
                  handleExpand={handleExpand}
                />
              ))
            )}
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TpdiSubscriptionsContainer);
