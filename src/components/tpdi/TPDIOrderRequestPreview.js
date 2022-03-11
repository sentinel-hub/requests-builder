import React from 'react';
import { connect } from 'react-redux';
import {
  getDeleteOrderTpdiCurlCommand,
  getCreateViaProductsTpdiCurlCommand,
  getCreateViaDataFilterTpdiCurlCommand,
  getAllOrdersTpdiCurlCommand,
  getConfirmOrderTpdiCurlCommand,
} from './utils/curls';
import debounceRender from 'react-debounce-render';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { getRequestBody } from '../process/requests/parseRequest';
import { parseTPDIRequest } from './parse';
import { addWarningAlert } from '../../store/alert';

const TPDIOrderRequestPreview = ({
  state,
  getOrdersResponse,
  createQueryResponse,
  createProductsResponse,
}) => {
  const handleParse = (text) => {
    try {
      const parsed = JSON.parse(getRequestBody(text));
      parseTPDIRequest(parsed);
    } catch (err) {
      addWarningAlert(
        'Error while parsing!\nRemember that only the body of the request and the generated curl commands by the app can be parsed.',
      );
      console.error(err);
    }
  };

  return (
    <>
      <h2 className="heading-secondary">Request Preview</h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              name: 'create with datafilter',
              value: getCreateViaDataFilterTpdiCurlCommand(state),
              toggledValue: createQueryResponse,
            },
            {
              name: 'create with products ids',
              value: getCreateViaProductsTpdiCurlCommand(state),
              toggledValue: createProductsResponse,
            },
            {
              name: 'get all orders',
              value: getAllOrdersTpdiCurlCommand(state),
              toggledValue: getOrdersResponse,
            },
            {
              name: 'confirm order',
              value: getConfirmOrderTpdiCurlCommand(state),
              nonToggle: true,
            },
            {
              name: 'delete order',
              value: getDeleteOrderTpdiCurlCommand(state),
              nonToggle: true,
            },
          ]}
          canCopy
          className="tpdi-order-preview"
          onParse={handleParse}
          supportedParseNames={['create with datafilter', 'create with products ids']}
          id="tpdi-order-req-preview"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  state,
});

const debouncedComponent = debounceRender(TPDIOrderRequestPreview, 500);

export default connect(mapStateToProps)(debouncedComponent);
