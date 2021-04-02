import React, { useEffect, useState } from 'react';
import store from '../../store';
import alertSlice from '../../store/alert';
import { parseTPDIRequest } from './parse';
import { airbusOrderDemo } from './utils/const';
import { connect } from 'react-redux';
import { getTPDIQuota } from './requests/common';
import Axios from 'axios';

const checkIfHasNonZeroQuota = (res) => {
  if (res.data && res.data.data && res.data.data.length > 0) {
    const nonZeroQuotas = res.data.data.filter((q) => q.quotaSqkm !== 0);
    return nonZeroQuotas.length > 0;
  }
  return false;
};

const TPDIBannerInfo = ({ token }) => {
  const [hasQuota, setHasQuota] = useState(true);
  const shouldRenderTpdiBanner = Boolean(token && !hasQuota);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    const fetchQuota = async () => {
      try {
        const res = await getTPDIQuota(token, { cancelToken: source.token });
        const hasNonZero = checkIfHasNonZeroQuota(res);
        if (!hasNonZero) {
          setHasQuota(false);
        }
      } catch (err) {
        if (!Axios.isCancel(err)) {
          console.error(err);
        }
      }
    };
    if (token) {
      fetchQuota();
    }
    return () => {
      source.cancel();
    };
  }, [token]);

  const handleStartAirbusDemo = () => {
    parseTPDIRequest(airbusOrderDemo);
    store.dispatch(
      alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Airbus Demo successfully started' }),
    );
  };
  // const handleStartPlanetDemo = () => {
  //   parseTPDIRequest(planetDemoOrder);
  //   store.dispatch(
  //     alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Planet Demo successfully started' }),
  //   );
  // };

  return shouldRenderTpdiBanner ? (
    <div className="info-banner u-margin-bottom-small">
      <p>
        TPDI is disabled by default for all users. You can find more information on buying a package on the
        following links:{' '}
        <a
          href="https://docs.sentinel-hub.com/api/latest/data/planet-scope/#purchasing-the-data"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          PLANET
        </a>
        ,{' '}
        <a
          href="https://docs.sentinel-hub.com/api/latest/data/airbus/pleiades/#purchasing-pleiades-data"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          AIRBUS - PHR
        </a>
        ,{' '}
        <a
          href="https://docs.sentinel-hub.com/api/latest/data/airbus/spot/#purchasing-spot-data"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          AIRBUS - SPOT
        </a>
      </p>
      <p>
        <a href="mailto:info@sentinel-hub.com" target={'_blank'} rel="noopener noreferrer">
          Contact us
        </a>{' '}
        for demo access, and start a demo request clicking on one of the following links:{' '}
        {/* <button className="button-link" onClick={handleStartPlanetDemo}>
          PLANET
        </button>{' '} */}
        <button className="button-link" onClick={handleStartAirbusDemo}>
          AIRBUS
        </button>
      </p>
      <p>
        Click on `Prepare Order` (either using query or using products). While in demo mode you cannot modify
        any parameter or the request won't have cost 0.
      </p>
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDIBannerInfo);
