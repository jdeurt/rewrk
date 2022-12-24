import type { Async } from "./async";
import type { Func } from "./function";

export type AsyncFunctionProps<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Func ? Async<T[K]> : never;
};
