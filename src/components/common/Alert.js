import React from 'react';
import { connect } from 'react-redux';
import { InformationCircleIcon, ExclamationIcon, CheckCircleIcon } from '@heroicons/react/solid';
import store from '../../store';
import alertSlice from '../../store/alert';

const generateAlertClass = (type) => {
  if (type === 'SUCCESS') {
    return 'alert--success';
  } else if (type === 'WARNING') {
    return 'alert--warning';
  } else if (type === 'INFO') {
    return 'alert--info';
  } else {
    return '';
  }
};

const generateEmoji = (type) => {
  if (type === 'SUCCESS') {
    return <CheckCircleIcon className="w-8" />;
  } else if (type === 'WARNING') {
    return <ExclamationIcon className="w-8" />;
  } else if (type === 'INFO') {
    return <InformationCircleIcon className="w-8" />;
  } else {
    return '';
  }
};

const Alert = ({ alert }) => {
  const { type, text } = alert;
  const splittedText = text.split('\n');
  const removeAlertHandler = () => {
    store.dispatch(alertSlice.actions.removeAlert(alert.id));
  };

  return (
    <>
      {alert.id ? (
        <div onClick={removeAlertHandler} className={`alert ${generateAlertClass(type)}`}>
          <div className="alert-first-item">{generateEmoji(type)}</div>
          <div className="alert-second-item">
            {splittedText.map((text, idx) => (
              <p key={`alert-${idx}`}>{text}</p>
            ))}
          </div>
          <div className="alert-third-item">
            <span>&#10005;</span>
          </div>
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  alert: state.alert,
});

export default connect(mapStateToProps)(Alert);
