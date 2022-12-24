import type { ExecuteMessage } from "../types/worker-message";

const workerMessageHandler = (fns: Record<string, Function>) => {
    self.addEventListener(
        "message",
        async ({
            data: [command, id, fnName, args],
        }: MessageEvent<ExecuteMessage>) => {
            if (command !== "exec") {
                return;
            }

            try {
                const result = await fns[fnName]?.(...args);

                self.postMessage(["exec_success", id, result]);
            } catch (err) {
                self.postMessage(["exec_failure", id, err]);
            }
        }
    );
};

export function makeWorkerFn(workerModule: Record<string, unknown>) {
    const moduleFns = Object.entries(workerModule).filter(
        ([, v]) => typeof v === "function"
    ) as [string, Function][];

    const objStr = `{${moduleFns
        .map(([fnName, fn]) => `${fnName}:${fn}`)
        .join(",")}}`;

    return new Function(`(${workerMessageHandler.toString()})(${objStr})`);
}
