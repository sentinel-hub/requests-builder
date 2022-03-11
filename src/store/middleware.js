import modalSlice from './modal';
import tpdiSlice from './tpdi';

export const asyncDispatchMiddleware = (store) => (next) => (action) => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach((a) => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

  const res = next(actionWithAsyncDispatch);

  syncActivityFinished = true;
  flushQueue();

  return res;
};

/*
  Middleware to display a modal once a tpdi order changes geometry in the middle.
  Added on the initalization of tpdi form.
*/
const MAP_GEOMETRY_CHANGE_ACTION_TYPE = 'map/setWgs84Geometry';
const shouldInterceptGeometryChange = (store, action) => {
  const state = store.getState();
  const mode = state.request.mode;
  const isUsingProducts = !state.tpdi.isUsingQuery;
  const actionType = action.type;
  return (
    mode === 'TPDI' &&
    actionType === MAP_GEOMETRY_CHANGE_ACTION_TYPE &&
    isUsingProducts &&
    Boolean(state.tpdi.products.find((prod) => Boolean(prod.id)))
  );
};
export const tpdiGeometryModalMiddleware = (store) => (next) => (action) => {
  if (shouldInterceptGeometryChange(store, action)) {
    store.dispatch(
      modalSlice.actions.openModal({
        onConfirm: () => {
          next(action);
          next(tpdiSlice.actions.clearProducts());
        },
        content:
          'Changing the geometry will reset the TPDI order to avoid ordering products that are not covered by the AOI.',
      }),
    );
  } else {
    return next(action);
  }
};
