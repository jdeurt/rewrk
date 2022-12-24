export type ExecuteMessage<T = unknown> = ["exec", string, string, T[]];
export type SuccessMessage<T = unknown> = ["exec_success", string, T];
export type FailureMessage<E = unknown> = ["exec_failure", string, E];
