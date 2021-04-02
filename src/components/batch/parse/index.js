import store from '../../../store';
import batchSlice from '../../../store/batch';

export const getBucketName = (member) => {
  if (member.bucketName !== undefined) {
    return member.bucketName;
  }
  //tilepath
  else {
    return member.output.defaultTilePath.split('/')[2];
  }
};

export const parseBatchRequest = (props) => {
  const bucketName = getBucketName(props);
  store.dispatch(batchSlice.actions.resetBatchState());
  if (bucketName !== undefined) {
    store.dispatch(batchSlice.actions.setBucketName(bucketName));
  }
  if (props.description) {
    store.dispatch(batchSlice.actions.setDescription(props.description));
  }
  if (props.tilingGrid) {
    const { id, resolution } = props.tilingGrid;
    if (id) {
      store.dispatch(batchSlice.actions.setTillingGrid(id));
    }
    if (resolution) {
      store.dispatch(batchSlice.actions.setResolution(resolution));
    }
  }
  // check output parameters.
  if (props.output) {
    if (props.output.cogOutput) {
      store.dispatch(batchSlice.actions.setCogOutput(true));
    }
    if (props.output.defaultTilePath) {
      store.dispatch(batchSlice.actions.setSpecifyingBucketName(false));
      store.dispatch(
        batchSlice.actions.setDefaultTilePath(props.output.defaultTilePath.split(bucketName + '/')[1]),
      );
    }
    if (props.output.cogParameters) {
      store.dispatch(batchSlice.actions.setSpecifyingCogParams(true));
      const cogParams = props.output.cogParameters;
      if (cogParams.overviewLevels) {
        cogParams.overviewLevels = cogParams.overviewLevels.join(',');
      }
      store.dispatch(batchSlice.actions.setCogParametersAbsolute(cogParams));
    }
    if (props.output.createCollection) {
      store.dispatch(batchSlice.actions.setCreateCollection(true));
    }
    if (props.output.collectionId) {
      store.dispatch(batchSlice.actions.setCollectionId(props.output.collectionId));
    }
    if (props.output.overwrite) {
      store.dispatch(batchSlice.actions.setOverwrite(true));
    }
  }
};
