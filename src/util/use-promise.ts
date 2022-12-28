import { useEffect, useState } from "react";

export function usePromise<T>(promise: Promise<T>): T | undefined {
    const [value, setValue] = useState<T>();
    const [isFullfilled, setIsFullfilled] = useState(false);

    useEffect(() => {
        if (isFullfilled) return;

        promise.then((val) => {
            setIsFullfilled(true);
            setValue(val);
        });
    }, [promise]);

    return value;
}
