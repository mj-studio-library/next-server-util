import { is } from '@mj-studio/js-util';
import { NextResponse } from 'next/server';

import type { AppError, AppErrorCode } from './app-error';
import { allAppErrorCodes, appError, isAppError } from './app-error';

function getStatusCodeByAppError(e: AppError) {
  if (e.code === 'server-error') {
    return 500;
  }

  return 400;
}

export function appErrorResponse(e: AppErrorCode | Error | AppError | any) {
  if (is.object(e)) {
    if (isAppError(e)) {
      return NextResponse.json(e, { status: getStatusCodeByAppError(e) });
    } else {
      const error = appError('unknown');

      return NextResponse.json(error, { status: getStatusCodeByAppError(error) });
    }
  } else if (is.notEmptyString(e)) {
    const errorCode = allAppErrorCodes.includes(e as any) ? e : 'unknown';
    const error = appError(errorCode as AppErrorCode);

    return NextResponse.json(error, { status: getStatusCodeByAppError(error) });
  }
}

export function appJsonResponse(json: Record<string, any>) {
  return NextResponse.json(json, { status: 200 });
}

export function appEmptyResponse() {
  return new NextResponse();
}
