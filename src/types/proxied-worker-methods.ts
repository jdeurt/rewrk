import type { Async } from "./async";
import type { Func } from "./function";

export type ProxiedWorkerMethods<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Func ? Async<T[K]> : never;
};
