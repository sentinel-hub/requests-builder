import React, { useState } from 'react';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import RequestButton from '../common/RequestButton';
import { getQuotaCurlCommand } from './utils/curls';
import { connect } from 'react-redux';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { formatText } from '../../utils/stringUtils';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { formatNumber } from '../../utils/commonUtils';

const QuotaContainer = ({ token }) => {
  const [quotas, setQuotas] = useState([]);
  const [quotaResponse, setQuotaResponse] = useState();

  const handleGetQuota = (response) => {
    setQuotas(response.data);
    setQuotaResponse(JSON.stringify(response.data, null, 2));
  };
  return (
    <div className="quota-container">
      <h2 className="heading-secondary">Quota</h2>
      <div className="form">
        <div className="quota-container-items">
          <div className="mr-2 ml-1 mb-2">
            {quotas.length > 0 ? (
              quotas.map((quota) => (
                <div className="mb-2" key={quota.id}>
                  <p className="text mt-1">
                    <span>{formatText(quota.collectionId.replace('_', ' '))}</span>
                  </p>
                  <div style={{ marginLeft: '0.5rem' }}>
                    <p className="text">
                      <span>Total: </span>
                      {formatNumber(quota.quotaSqkm, 3)} km<sup>2</sup>
                    </p>
                    <p className="text">
                      <span>Used: </span>
                      {formatNumber(quota.quotaUsed, 3)} km<sup>2</sup>
                    </p>
                    <p className="text">
                      <span>Remaining: </span>
                      {formatNumber(quota.quotaSqkm - quota.quotaUsed, 3)} km<sup>2</sup>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text">Fetch your quotas to see them</p>
            )}
            <RequestButton
              request={TpdiResource.getQuota}
              args={[]}
              buttonText={quotas.length > 0 ? 'Refresh Quotas' : 'Get Quotas'}
              validation={Boolean(token)}
              additionalClassNames={['mt-1', 'ml-3']}
              className="secondary-button"
              responseHandler={handleGetQuota}
              disabledTitle="Log in to use this"
              errorHandler={errorHandlerTPDI}
            />
          </div>

          <div className="quota-container-items--second-item">
            <p className="text mt-1">
              <span>Request Preview</span>
            </p>
            <CommonRequestPreview
              options={[
                {
                  name: 'quota',
                  value: getQuotaCurlCommand(token),
                  toggledValue: quotaResponse,
                },
              ]}
              className="quota-preview"
              canCopy
              id="quota-req-preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(QuotaContainer);
