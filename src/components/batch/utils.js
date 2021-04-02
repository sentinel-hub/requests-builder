import store from '../../store';
import alertSlice from '../../store/alert';

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

//check if valid uuid.
const checkValidId = (id) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

export const batchIdValidation = (token, batchId) => token && checkValidId(batchId);
