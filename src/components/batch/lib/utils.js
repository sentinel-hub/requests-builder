import store from '../../../store';
import alertSlice from '../../../store/alert';
import { checkValidUuid } from '../../../utils/stringUtils';

export const addAlertOnError = (error, message) => {
  if (error.response?.status === 403) {
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: "You don't have enough permissions to use this",
      }),
    );
  } else if (message) {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: message }));
    console.error(error);
  } else {
    try {
      const err = error.response.data.error;
      let errorMsg = err.message;
      if (err.errors) {
        errorMsg += err.errors.map((subErr) => (subErr.violation ? '\n' + subErr.violation : ''));
      }
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: errorMsg }));
    } catch (exc) {
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
      console.error(error);
    }
  }
};

export const batchIdValidation = (token, batchId) => token && checkValidUuid(batchId);

export const isCreatedStatus = (status) =>
  status === 'ANALYSING' || status === 'ANALYSIS_DONE' || status === 'CREATED';

export const isRunningStatus = (status) => status === 'PROCESSING';

export const isFinishedStatus = (status) =>
  status === 'DONE' || status === 'PARTIAL' || status === 'FAILED' || status === 'CANCELED';

export const canAnalyse = (status) => status === 'CREATED';

export const canStart = (status) => status !== 'DONE' && status !== 'CANCELED';

export const canCancel = (status) => status !== 'DONE';

export const canRestart = (status) => status !== 'DONE';
