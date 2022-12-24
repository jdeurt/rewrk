import { useEffect, useState } from "react";

import type { AsyncFunctionProps } from "../types/async-function-props";
import { makeWorkerDispatchProxy } from "../util/make-worker-dispatch-proxy";
import { makeWorkerFn } from "../util/make-worker-fn";
import { makeWorkerURL } from "../util/make-worker-url";

export function useWorker<T extends Record<string, unknown>>(
    dynamicImport: Promise<T>
) {
    const [worker, setWorker] = useState<Worker>();
    const [workerProxy, setWorkerProxy] = useState<AsyncFunctionProps<T>>();

    useEffect(() => {
        dynamicImport.then((importedModule) => {
            const workerModule = Object.fromEntries(
                Object.entries(importedModule).filter(
                    ([, v]) => typeof v === "function"
                )
            ) as T;

            const workerFn = makeWorkerFn(workerModule);
            const workerURL = makeWorkerURL(workerFn);
            const workerObj = new Worker(workerURL);

            setWorker(workerObj);
            setWorkerProxy(makeWorkerDispatchProxy(workerObj, workerModule));
        });

        return () => {
            worker?.terminate();
            setWorker(undefined);
            setWorkerProxy(undefined);
        };
    }, []);

    return workerProxy;
}
