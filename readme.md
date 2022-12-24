# Rewrk

[![Version](https://img.shields.io/npm/v/sgex.svg)](https://www.npmjs.com/package/rewrk)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D16-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Dead simple React web workers.

## Usage

#### some.worker.js

```jsx
export function foo(bar, baz) {
    return bar + baz;
}
```

#### my-component.jsx

```jsx
import { useWorker } from "rewrk";

export const MyComponent = (props) => {
    const worker = useWorker(import("./some.worker.js"));

    useEffect(() => {
        worker?.foo(1, 2).then(console.log); // 3
    }, [worker]);

    return worker === undefined ? (
        <span>Loading...</span>
    ) : (
        <span>Worker ready!</span>
    );
};
```

## License

MIT © [Juan de Urtubey](https://jdeurt.xyz)
