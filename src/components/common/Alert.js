import React from 'react';
import { connect } from 'react-redux';
import store, { alertSlice } from '../../store';

const generateAlertClass = (type) => {
  if (type === 'SUCCESS') {
    return 'alert--success';
  } else if (type === 'WARNING') {
    return 'alert--warning';
  } else {
    return '';
  }
};

const generateEmoji = (type) => {
  if (type === 'SUCCESS') {
    return '✅';
  } else if (type === 'WARNING') {
    return '⚠️';
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
          <div className="alert-first-item">
            <span>{generateEmoji(type)}</span>
          </div>
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
