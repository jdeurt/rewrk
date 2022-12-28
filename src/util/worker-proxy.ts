import type { ProxiedWorkerMethods } from "../types/proxied-worker-methods";
import type { FailureMessage, SuccessMessage } from "../types/worker-message";
import { makeId } from "./make-id";

type WorkerOperation = [
    [resolve: (value: unknown) => void, reject: (err: unknown) => unknown],
    [name: string, args: unknown[]]
];

export class WorkerProxy<T extends Record<string, unknown>> {
    private operationProvider = new Proxy({} as ProxiedWorkerMethods<T>, {
        get:
            (_, name: string) =>
            async (...args: unknown[]) =>
                new Promise((resolve, reject) => {
                    this.operations[makeId()] = [
                        [resolve, reject],
                        [name, args],
                    ];

                    this.cycleOperations();
                }),
    });
    private operationConsumer?: Worker;

    private operations: Record<string, WorkerOperation> = {};
    private busyOperationIds = new Set<string>();

    private operationConsumerListener = ({
        data: [type, id, value],
    }: MessageEvent<SuccessMessage | FailureMessage>) => {
        const [resolveOrReject] = this.operations[id] ?? [];

        resolveOrReject?.[{ exec_success: 0, exec_failure: 1 }[type]](value);

        delete this.operations[id];
    };

    get methods(): ProxiedWorkerMethods<T> {
        return this.operationProvider;
    }

    attachConsumer(worker: Worker): void {
        this.operationConsumer = worker;

        this.operationConsumer.onmessage = this.operationConsumerListener;

        this.cycleOperations();
    }

    detachConsumer(): void {
        (this.operationConsumer ?? ({} as any)).onmessage = undefined;

        this.busyOperationIds.clear();
    }

    cycleOperations(): void {
        if (!this.operationConsumer) return;

        for (const id in this.operations) {
            if (this.busyOperationIds.has(id)) continue;

            this.executeOperation(id, this.operations[id]);

            this.busyOperationIds.add(id);
        }
    }

    executeOperation(id: string, operation: WorkerOperation): void {
        if (!this.operationConsumer) return;

        const [, [name, args]] = operation;

        this.operationConsumer.postMessage(["exec", id, name, args]);
    }
}
