import 'server-only';

import { is } from '@mj-studio/js-util';
import type { NextRequest } from 'next/server';
import type { InferType, ObjectSchema } from 'yup';
import { ValidationError } from 'yup';

import { appError, isAppError } from './app-error';
import { appErrorResponse, appJsonResponse } from './appResponse';

export function createRoute<
  Res extends Response,
  BodySchema extends object = never,
  BodyResponse = BodySchema extends object ? InferType<ObjectSchema<BodySchema>> : undefined,
>(
  {
    bodySchema,
    onError,
  }: {
    onError?: (e: any) => Promise<Res | undefined | void> | Res | undefined | null | void;
    bodySchema?: ObjectSchema<BodySchema>;
  },
  fn: (params: {
    req: NextRequest;
    body: BodyResponse;
  }) => Promise<Res | undefined | void> | Res | void | null | undefined,
) {
  return async (req: NextRequest) => {
    try {
      let ret: any;
      if (!!bodySchema) {
        const body = await bodySchema.validate(await req.json());

        ret = await fn({ req, body: body as BodyResponse });
      } else {
        ret = await fn({ req, body: undefined as BodyResponse });
      }

      if (is.nullOrUndefined(ret)) {
        ret = appJsonResponse({});
      }

      return ret;
    } catch (catched) {
      let e: any;
      if (catched instanceof ValidationError) {
        e = appError('invalid-input', { message: catched.errors.join(','), e: catched });
      } else if (catched instanceof SyntaxError && catched.message.includes('JSON')) {
        e = appError('invalid-input', { message: 'json parse failed', e: catched });
      } else {
        e = catched;
      }

      const errorRes = await onError?.(e);
      if (errorRes) {
        return errorRes;
      }

      if (!isAppError(e)) {
        e = appError('server-error', {
          e,
          message:
            is.object(e) && is.notEmptyString(e.message) ? e.message : 'unknown server error',
        });
      }

      return appErrorResponse(e);
    }
  };
}
