import { getMessageFromApiError } from '../../../api';
import { addWarningAlert } from '../../../store/alert';
import { checkValidUuid } from '../../../utils/stringUtils';

export const addAlertOnError = (error, message) => {
  addWarningAlert(getMessageFromApiError(error, message));
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

export const canRestart = (status) => status === 'PARTIAL';
