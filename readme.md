# Rewrk

[![Version](https://img.shields.io/npm/v/sgex.svg)](https://www.npmjs.com/package/rewrk)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D16-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Dead simple React web workers.

## Usage

```jsx
import { useWorker } from "rewrk";

export const MyComponent = (props) => {
    // From a worker file
    const workerFromFile = useWorker("./relative/path/to/worker.js");

    // Or from a function
    const workerFromFunction = useWorker(
        (props) => {
            doSomethingHeavyWith(props);
        },
        [props]
    );
};
```

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
