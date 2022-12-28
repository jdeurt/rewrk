import { useEffect, useState } from "react";

export function usePromise<T>(promise: Promise<T>): T | undefined {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        promise.then(setValue);
    }, [promise]);

    return value;
}
