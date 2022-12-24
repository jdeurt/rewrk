export function makeWorkerURL(workerFn: Function): URL {
    return new URL(URL.createObjectURL(new Blob([`(${workerFn})()`])));
}
