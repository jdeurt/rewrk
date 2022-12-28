import { useEffect } from "react";

import type { ProxiedWorkerMethods } from "../types/proxied-worker-methods";
import { makeWorkerFn } from "../util/make-worker-fn";
import { makeWorkerURL } from "../util/make-worker-url";
import { WorkerProxy } from "../util/worker-proxy";

/**
 * Creates a worker from a dynamic import and returns a proxy object that can be used to call the worker's exported functions.
 * @param dynamicImport A dynamic import of the worker module. The module must export at least one function. Non-function exports will be stripped away.
 * @param options Options to pass to the worker constructor. By default the `type` option is set to `"module"`.
 * @returns A proxy object that can be used to call the worker's exported functions. The proxy object will be available immidiately despite the dynamic import returning a Promise.
 */
export function useWorker<T extends Record<string, unknown>>(
    dynamicImport: Promise<T>,
    options?: WorkerOptions
): ProxiedWorkerMethods<T> {
    const workerProxy = new WorkerProxy<T>();

    useEffect(() => {
        dynamicImport.then((workerModule) => {
            const workerFn = makeWorkerFn(workerModule);
            const workerURL = makeWorkerURL(workerFn);

            workerProxy.attachConsumer(
                new Worker(workerURL, {
                    type: "module",
                    ...options,
                })
            );
        });

        return () => {
            workerProxy.destroyConsumer();
        };
    }, []);

    return workerProxy.methods;
}
