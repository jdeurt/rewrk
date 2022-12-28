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

                    console.log("Producing operation", this, name, args);

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

        console.log("Consumed operation", type, id, value);

        delete this.operations[id];
    };

    get methods(): ProxiedWorkerMethods<T> {
        return this.operationProvider;
    }

    attachConsumer(worker: Worker): void {
        console.log("Attaching consumer", worker);

        this.operationConsumer = worker;

        this.operationConsumer.onmessage = this.operationConsumerListener;

        this.cycleOperations();
    }

    detachConsumer(): void {
        console.log("Dettaching consumer", this.operationConsumer);

        (this.operationConsumer ?? ({} as any)).onmessage = undefined;

        this.operationConsumer = undefined;

        this.busyOperationIds.clear();
    }

    cycleOperations(): void {
        console.log("Should cycle operations", this.operationConsumer);

        if (!this.operationConsumer) return;

        console.log(
            "Cycling operations",
            this.operations,
            this.busyOperationIds
        );

        for (const id in this.operations) {
            if (this.busyOperationIds.has(id)) continue;

            this.executeOperation(id, this.operations[id]);

            this.busyOperationIds.add(id);
        }
    }

    executeOperation(id: string, operation: WorkerOperation): void {
        if (!this.operationConsumer) return;

        const [, [name, args]] = operation;

        console.log("Consuming operation", id, name, args);

        this.operationConsumer.postMessage(["exec", id, name, args]);
    }
}
