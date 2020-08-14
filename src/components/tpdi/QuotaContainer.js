import React, { useState } from 'react';
import { errorHandlerNoEnoughPermissions } from './TPDIOrderOptions';
import RequestButton from '../RequestButton';
import { getTPDIQuota } from './generateTPDIRequests';
import { connect } from 'react-redux';

const QuotaContainer = ({ token }) => {
  const [quotas, setQuotas] = useState([]);

  const handleGetQuota = (response) => {
    setQuotas(response.data);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="heading-secondary">Quota</h2>
      <div className="form">
        <div className="u-margin-bottom-small">
          <RequestButton
            request={getTPDIQuota}
            args={[token]}
            buttonText={quotas.length > 0 ? 'Refresh Quotas' : 'Get Quotas'}
            validation={Boolean(token)}
            className="secondary-button"
            responseHandler={handleGetQuota}
            disabledTitle="Log in to use this"
            errorHandler={errorHandlerNoEnoughPermissions}
          />
        </div>

        {quotas.map((quota) => (
          <div className="u-margin-bottom-small" key={quota.id}>
            <p className="text u-margin-bottom-tiny">
              <span>{quota.datasetId.replace('_', ' ')}</span>
            </p>
            <div style={{ marginLeft: '0.5rem' }}>
              <p className="text">
                <span>Quota Remaining: </span>
                {(quota.quotaSqkm - quota.quotaUsed).toPrecision(3)} sqKm
              </p>
              <p className="text">
                <span>Total: </span>
                {quota.quotaSqkm.toPrecision(3)} sqKm
              </p>
              <p className="text">
                <span>Quota used: </span>
                {quota.quotaUsed.toPrecision(3)} sqKm
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(QuotaContainer);
