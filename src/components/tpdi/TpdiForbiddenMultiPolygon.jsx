import React from 'react';
import { connect } from 'react-redux';

const UNSUPPORTED_MULTIPOLYGONS_PROVIDERS = ['MAXAR'];

const TpdiForbiddenMultiPolygon = ({ provider }) => {
  if (UNSUPPORTED_MULTIPOLYGONS_PROVIDERS.includes(provider)) {
    return <p className="ml-3 font-bold text-red-700">Warning! {provider} does not support MultiPolygons</p>;
  }
  return null;
};

const mapStateToProps = (state) => ({
  provider: state.tpdi.provider,
});

export default connect(mapStateToProps)(TpdiForbiddenMultiPolygon);
