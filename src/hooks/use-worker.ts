import { useEffect, useState } from "react";
import { OnWorkerReadyCallback } from "../types/on-worker-ready-callback";

import { WorkerMethods } from "../types/worker-methods";
import { makeWorkerDispatchProxy } from "../util/make-worker-dispatch-proxy";
import { makeWorkerFn } from "../util/make-worker-fn";
import { makeWorkerURL } from "../util/make-worker-url";

export function useWorker<T extends Record<string, unknown>>(
    dynamicImport: Promise<T>,
    onReady?: OnWorkerReadyCallback<T>,
    options?: WorkerOptions
): WorkerMethods<T> | undefined {
    const [worker, setWorker] = useState<Worker>();
    const [workerProxy, setWorkerProxy] = useState<WorkerMethods<T>>();

    useEffect(() => {
        dynamicImport.then((importedModule) => {
            const workerModule = Object.fromEntries(
                Object.entries(importedModule).filter(
                    ([, v]) => typeof v === "function"
                )
            ) as T;

            const workerFn = makeWorkerFn(workerModule);
            const workerURL = makeWorkerURL(workerFn);
            const workerObj = new Worker(workerURL, {
                type: "module",
                ...options,
            });

            setWorker(workerObj);
            setWorkerProxy(makeWorkerDispatchProxy(workerObj, workerModule));
        });

        return () => {
            worker?.terminate();
            setWorker(undefined);
            setWorkerProxy(undefined);
        };
    }, []);

    useEffect(() => {
        if (!worker || !workerProxy || !onReady) {
            return;
        }

        return onReady(workerProxy);
    }, [worker, workerProxy]);

    return workerProxy;
}
