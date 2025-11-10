import { useState, useEffect, useCallback, useRef } from "react";

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel timeout if value changes before delay ends
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}



export function useDebouncedCallback(callback, delay = 500) {
    const timeoutRef = useRef();

    const debouncedFn = useCallback((...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    return debouncedFn;
}
