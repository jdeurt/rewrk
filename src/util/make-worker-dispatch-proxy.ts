import { WorkerMethods } from "../types/worker-methods";
import type { FailureMessage, SuccessMessage } from "../types/worker-message";

export function makeWorkerDispatchProxy<T extends Record<string, unknown>>(
    worker: Worker,
    workerModule: T
) {
    return new Proxy(workerModule, {
        get:
            (_, propName) =>
            (...args: unknown[]) =>
                new Promise((resolve, reject) => {
                    const thisId = Date.now().toString();

                    worker.postMessage(["exec", thisId, propName, args]);

                    const resultListener = ({
                        data: [type, id, value],
                    }: MessageEvent<SuccessMessage | FailureMessage>) => {
                        if (id !== thisId) {
                            return;
                        }

                        if (type === "exec_success") {
                            resolve(value);
                        } else if (type === "exec_failure") {
                            reject(value);
                        }

                        worker.removeEventListener("message", resultListener);
                    };

                    worker.addEventListener("message", resultListener);
                }),
    }) as WorkerMethods<T>;
}
