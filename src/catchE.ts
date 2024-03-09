import type { AppErrorCode } from './app-error';
import { isAppError } from './app-error';

export function catchE<T>(e: T, handlers: { [key in AppErrorCode | 'default']?: (e: T) => void }) {
  if (!isAppError(e)) {
    handlers.default?.(e);
  } else {
    const code = e.code;
    if (code in handlers) {
      handlers[code]!(e);
    } else {
      handlers.default?.(e);
    }
  }
}
