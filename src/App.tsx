import React, { useEffect } from 'react';
import ProcessRequestForm from './components/forms/RequestForm';
import configureAxios from './utils/configureAxios';
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
    default:
      return null;
    }
}

const getHeaderButtons =  mode => {
  if (mode === 'PROCESS') {
    return <ProcessHeaderButtons />
  }
  else if (mode === 'BATCH' || mode === 'TPDI') {
    return <BatchHeaderButtons />
  }
  else if (mode === 'WMS') {
    return <WMSHeaderButtons />
  }
}

function App({mode}) {

  useEffect(() => {
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
