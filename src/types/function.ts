export type Func<T extends unknown[] = unknown[], R = unknown> = (
    ...args: T
) => R;
