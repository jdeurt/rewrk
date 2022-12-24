import type { Async } from "./Async";
import type { Func } from "./function";

export type AsyncFunctionProps<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Func ? Async<T[K]> : never;
};
