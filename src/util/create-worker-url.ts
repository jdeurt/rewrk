export function createWorkerURL<T extends unknown[]>(
    workerFnOrFilePath: ((context?: T) => unknown) | string,
    context?: T
): URL {
    if (typeof workerFnOrFilePath === "function") {
        return new URL(
            URL.createObjectURL(
                new Blob([`(${workerFnOrFilePath})(${context?.join(",")})`])
            )
        );
    }

    return new URL(workerFnOrFilePath, import.meta.url);
}
