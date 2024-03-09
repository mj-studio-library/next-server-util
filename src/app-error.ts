import { is } from '@mj-studio/js-util';

export const allAppErrorCodes = ['unknown', 'server-error', 'invalid-input'] as const;
export type AppErrorCode = (typeof allAppErrorCodes)[number];
export const getAppErrorMessage = (error: AppErrorCode) => {
  switch (error) {
    case 'invalid-input':
      return 'Invalidate Input';
    case 'server-error':
      return 'Server Error';
    default:
      return 'Unknown Error Occured!';
  }
};

export type AppError = {
  __isAppError: true;
  code: AppErrorCode;
  message?: string;
  e?: any;
};
export function isAppError(e: any): e is AppError {
  return is.plainObject(e) && e['__isAppError'] === true;
}

export function appError(
  code: AppErrorCode,
  { message, e }: { message?: string; e?: any } = {},
): AppError {
  return {
    __isAppError: true,
    code,
    message,
    e,
  };
}
