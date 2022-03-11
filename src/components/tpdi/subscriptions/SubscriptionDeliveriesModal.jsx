import React from 'react';
import TpdiResource from '../../../api/tpdi/TpdiResource';
import { usePaginatedData } from '../../../utils/hooks';
import Pagination from '../../common/Pagination';
import Tooltip from '../../common/Tooltip/Tooltip';
import BaseModal from '../BaseModal';
import { getFormattedDatetime } from '../utils';

const DeliveriesTable = ({ subscriptionId }) => {
  const { results, isFetching, currentPage, maxPage, hasError, setPage } = usePaginatedData(
    ({ viewtoken }) =>
      TpdiResource.getSubscriptionDeliveries(
        { subscriptionId },
        {
          params: {
            viewtoken,
          },
        },
      ),
    [],
    'created:desc',
  );

  if (isFetching) {
    return (
      <p style={{ width: '600px' }} className="h-96">
        Fetching...
      </p>
    );
  }
  if (hasError) {
    return <p>Something went wrong fetching deliveries</p>;
  }
  return (
    <div style={{ width: '600px' }} className="overflow-y-scroll h-96 mr-4">
      <Pagination currentPage={currentPage} maxPage={maxPage} setPage={setPage} />
      <table className="primary-table w-full">
        <thead className="primary-table__header">
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Created</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody className="primary-table__body">
          {results.length === 0 ? (
            <tr>
              <td colSpan={4}>Deliveries not found</td>
            </tr>
          ) : (
            results.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.id}</td>
                <td>{delivery.status}</td>
                <td>{getFormattedDatetime(delivery.created)}</td>
                <td>
                  {delivery.errorMessage ? (
                    <Tooltip content={delivery.errorMessage} direction="right" />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const SubscriptionDeliveriesModal = ({ subscriptionId }) => {
  return (
    <BaseModal
      trigger={<button className="underline-button ml-2">Deliveries</button>}
      content={() => <DeliveriesTable subscriptionId={subscriptionId} />}
    />
  );
};

export default SubscriptionDeliveriesModal;
