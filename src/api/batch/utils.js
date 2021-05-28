import omit from 'lodash.omit';
import { isEmpty } from '../../utils/const';

import { getRequestObject } from '../process/utils';

const handleAdvancedCogParams = (batchState) => {
  const cogParams = {};
  const stateCogParameters = batchState.cogParameters;
  if (stateCogParameters.overviewLevels) {
    try {
      const overviewLevels = stateCogParameters.overviewLevels
        .split(',')
        .map((n) => parseInt(n))
        .filter((n) => n);
      if (overviewLevels.length > 0) {
        cogParams.overviewLevels = overviewLevels;
      }
    } catch (err) {}
  }

  if (stateCogParameters.overviewMinSize) {
    const overviewMinSize = parseInt(stateCogParameters.overviewMinSize);
    if (overviewMinSize) {
      cogParams.overviewMinSize = overviewMinSize;
    }
  }

  if (stateCogParameters.blockxsize) {
    const blockxsize = parseInt(stateCogParameters.blockxsize);
    if (blockxsize) {
      cogParams.blockxsize = blockxsize;
    }
  }

  if (stateCogParameters.blockysize) {
    const blockysize = parseInt(stateCogParameters.blockysize);
    if (blockysize) {
      cogParams.blockysize = blockysize;
    }
  }

  if (stateCogParameters.usePredictor !== undefined) {
    cogParams.usePredictor = stateCogParameters.usePredictor;
  }

  if (stateCogParameters.resamplingAlgorithm) {
    cogParams.resamplingAlgorithm = stateCogParameters.resamplingAlgorithm;
  }

  return cogParams;
};

export const generateBatchBodyRequest = (requestState, batchState, mapState) => {
  const batchRequest = {};
  const processBody = getRequestObject(requestState, mapState);
  // omit width/height or resx/resy on batch create.
  processBody.output = { ...omit(processBody.output, ['resx', 'resy', 'width', 'height']) };
  batchRequest.processRequest = processBody;

  batchRequest.tilingGrid = {
    id: batchState.tillingGrid,
    resolution: batchState.resolution,
  };

  if (batchState.specifyingBucketName) {
    batchRequest.bucketName = batchState.bucketName;
  } else {
    batchRequest.output = {
      defaultTilePath: `s3://${batchState.bucketName}/${batchState.defaultTilePath}`,
    };
  }

  if (batchState.cogOutput) {
    batchRequest.output = {
      ...batchRequest.output,
      cogOutput: true,
    };
  }

  if (batchState.overwrite) {
    batchRequest.output = {
      ...batchRequest.output,
      overwrite: true,
    };
  }

  if (batchState.description) {
    batchRequest.description = batchState.description;
  }

  if (batchState.cogOutput && !batchState.createCollection) {
    const cogParams = handleAdvancedCogParams(batchState);
    if (!isEmpty(cogParams)) {
      batchRequest.output.cogParameters = cogParams;
    }
  }

  if (batchState.createCollection) {
    if (!batchRequest.output) {
      batchRequest.output = {};
    }
    batchRequest.output.createCollection = true;
  } else if (batchState.collectionId) {
    if (!batchRequest.output) {
      batchRequest.output = {};
    }
    batchRequest.output.collectionId = batchState.collectionId;
  }

  return batchRequest;
};
