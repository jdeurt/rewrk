import { WorkerMethods } from "./worker-methods";

type OnWorkerReadyCleanup = () => void;

export type OnWorkerReadyCallback<T extends Record<string, unknown>> = (
    workerMethods: WorkerMethods<T>
) => OnWorkerReadyCleanup | void;
