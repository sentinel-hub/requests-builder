import React, { useEffect } from 'react';
import ProcessRequestForm from './components/forms/RequestForm';
import configureAxios, { shResponseInterceptor, edcResponseInterceptor } from './utils/configureAxios';
import ModeSelector from './components/ModeSelector';
import { connect } from 'react-redux';
import ProcessHeaderButtons from './components/ProcessHeaderButtons';
import BatchHeaderButtons from './components/batch/BatchHeaderButtons';
import WMSHeaderButtons from './components/wms/WMSHeaderButtons';
import BatchRequestForm from './components/forms/BatchRequestForm';
import Alert from './components/Alert';
import TPDIRequestForm from './components/forms/TPDIRequestForm';
import WMSRequestForm from './components/wms/WMSRequestForm';
import HeaderLogo from './components/HeaderLogo';
import OverlayResponse from './components/OverlayResponse';
import CatalogRequestForm from './components/forms/CatalogRequestForm';
import '@fortawesome/free-solid-svg-icons/index';
import Axios from 'axios';
import store, { authSlice } from './store';

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
        shResponseInterceptor();    
        store.dispatch(authSlice.actions.setIsEDC(false));        
      }
    }
    fetchTokenEdc();
    configureAxios();
  }, []);

  return (
    <div className="App">
      <Alert />
      <OverlayResponse />
      <div className='header'>
        <div className='header__title'>
          <HeaderLogo />
        </div>
        {getHeaderButtons(mode)}
      </div>
      <ModeSelector />
      {getForm(mode)}
    </div>
  );
}

const mapStateToProps = store => ({
  mode: store.request.mode
});

export default connect(mapStateToProps, )(App);
