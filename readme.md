# Rewrk

[![Version](https://img.shields.io/npm/v/sgex.svg)](https://www.npmjs.com/package/rewrk)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D16-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Dead simple React web workers.

## API

### `useWorker<T extends Record<string, unknown>>(dynamicImport: Promise<T>, options?: WorkerOptions): ProxiedWorkerMethods<T>`

Creates a [worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) from a dynamic import and returns a proxy object that can be used to call the worker's exported functions.

#### Arguments

-   `dynamicImport` - A function that returns dynamic import of the worker module. The module must export at least one function. Non-function exports will be stripped away.
-   `options?` - Options to pass to the worker constructor. By default the `type` option is set to `"module"`.

#### Returns

A proxy object that can be used to call the worker's exported functions. The proxy object will be available immidiately despite the dynamic import returning a Promise.

#### Usage

```jsx
import { useWorker } from "rewrk";

const WorkerComponent = () => {
    const worker = useWorker(() => import("./worker"));

    return <button onClick={() => worker.doSomething()}>Do something</button>;
};
```

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
