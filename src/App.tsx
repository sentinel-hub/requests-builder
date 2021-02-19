import React, { useEffect, lazy, Suspense } from 'react';
import configureAxios, { edcResponseInterceptor } from './utils/configureAxios';
import ModeSelector from './components/common/ModeSelector';
import { connect } from 'react-redux';
import ProcessHeaderButtons from './components/process/ProcessHeaderButtons';
import BatchHeaderButtons from './components/batch/BatchHeaderButtons';
import WMSHeaderButtons from './components/wms/WMSHeaderButtons';
import Alert from './components/common/Alert';
import HeaderLogo from './components/common/HeaderLogo';
import OverlayResponse from './components/common/OverlayResponse';
import ProcessRequestForm from './forms/RequestForm';
import '@fortawesome/free-solid-svg-icons/index';
import Axios from 'axios';
import store from './store';
import authSlice from './store/auth';
import BatchBannerInfo from './components/batch/BatchBannerInfo';
import TPDIBannerInfo from './components/tpdi/TPDIBannerInfo';
import { configureParams, getUrlParams } from './params';
import StatisticalRequestForm from './forms/StatisticalRequestForm';
import StatisticalAuthHeader from './components/statistical/StatisticalAuthHeader';
import SavedRequests from './components/process/Collections/SavedRequests';

const BatchRequestForm = lazy(() => import('./forms/BatchRequestForm'));
const TPDIRequestForm = lazy(() => import('./forms/TPDIRequestForm'));
const CatalogRequestForm = lazy(() => import('./forms/CatalogRequestForm'));
const WMSRequestForm = lazy(() => import('./forms/WMSRequestForm'));

const getForm = mode => {
  switch(mode) {
    case('PROCESS'):
      return <ProcessRequestForm />
    case('BATCH'):
      return <BatchRequestForm />
    case('TPDI'):
      return <TPDIRequestForm />
    case('WMS'):
      return <WMSRequestForm />
    case('CATALOG'): 
      return <CatalogRequestForm />
    case('STATISTICAL'):
      return <StatisticalRequestForm />
    default:
      return null;
    }
}

const getHeaderButtons =  mode => {
  if (mode === 'PROCESS') {
    return <ProcessHeaderButtons />
  }
  else if (mode === 'BATCH' || mode === 'TPDI' || mode === 'CATALOG') {
    return <BatchHeaderButtons />
  }
  else if (mode === 'WMS') {
    return <WMSHeaderButtons />
  }
  else if (mode === "STATISTICAL") {
    return <StatisticalAuthHeader />
  }
}

const getInformativeBanner = mode => {
  switch(mode) {
    case 'BATCH':
      return <BatchBannerInfo />
    case 'TPDI':
      return <TPDIBannerInfo />
    default: 
      return null;
  }
}

function App({mode}) {

  useEffect(() => {
    const fetchTokenEdc = async () => {
      try {
        let res = await Axios.post('/token_sentinel_hub');
        if (res.data && res.data.access_token) {
          store.dispatch(authSlice.actions.setUser({userdata: 'EDC User', access_token: res.data.access_token}));
          edcResponseInterceptor();
        }
        else {
          throw new Error('Token not found');   
        }
      } catch (err) {
        store.dispatch(authSlice.actions.setIsEDC(false));        
      }
    }
    const setParams = async () => {
      await configureParams(getUrlParams());
    }
    fetchTokenEdc();
    configureAxios();
    setParams();
  }, []);

  return (
    <div className="App">
      <Alert />
      <OverlayResponse />
      <SavedRequests />
      <div className='header'>
        <div className='header__title'>
          <HeaderLogo />
        </div>
        {getHeaderButtons(mode)}
      </div>
      {getInformativeBanner(mode)}
      <ModeSelector />
      <Suspense fallback={<p className='text'>Loading...</p>}>
        {getForm(mode)}
      </Suspense>
    </div>
  );
}

const mapStateToProps = store => ({
  mode: store.request.mode
});

export default connect(mapStateToProps, )(App);
