# @mj-studio/next-server-util

## Peer Dependencies

- react
- react-dom
- next
- yup

## How to concat app error types?

Not yet supported

## Usage

```ts
import { appJsonResponse, createRoute } from '@mj-studio/next-server-util';

export const GET = createRoute({}, () => {
  return appJsonResponse({ data: Date.now() });
});

```
