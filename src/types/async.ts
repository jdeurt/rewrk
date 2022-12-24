import type { Func } from "./function";

export type Async<T extends Func> = (
    ...args: Parameters<T>
) => Promise<ReturnType<T>>;
