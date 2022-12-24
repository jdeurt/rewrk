import { useEffect, useState } from "react";
import { createWorkerURL } from "../util/create-worker-url";

export function useWorker<T extends unknown[]>(
    workerFn: (...contextualArgs: T) => unknown,
    context: T
): Worker;
export function useWorker(workerFn: () => unknown): Worker;
export function useWorker(workerFilePath: string): Worker;

export function useWorker<T extends unknown[]>(
    workerFnOrFilePath: ((context?: T) => unknown) | string,
    context?: T
): Worker {
    const [worker, setWorker] = useState(
        new Worker(createWorkerURL(workerFnOrFilePath, context))
    );

    useEffect(() => {
        setWorker(new Worker(createWorkerURL(workerFnOrFilePath, context)));
    }, context);

    return worker;
}
