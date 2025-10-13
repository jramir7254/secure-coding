import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function shuffleArrayEveryNewSpot<T>(array: Array<T>) {
    const n = array.length;
    if (n <= 1) {
        return array; // No shuffling needed or possible for 0 or 1 element
    }

    // Create a temporary copy to ensure we can check for original positions
    const tempArray = [...array];

    for (let i = n - 1; i > 0; i--) {
        let j;
        do {
            j = Math.floor(Math.random() * (i + 1));
        } while (tempArray[j] === array[i] && j === i); // Ensure element at j is not the original element at i, and not swapping with itself if it's the original element

        // Swap elements
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }

    // Final check to ensure no element is in its original position
    for (let i = 0; i < n; i++) {
        if (tempArray[i] === array[i]) {
            // If an element is still in its original spot, find a different spot for it
            let k;
            do {
                k = Math.floor(Math.random() * n);
            } while (k === i || tempArray[k] === array[i]); // Find a different spot k where the element at k is not the original element at i

            [tempArray[i], tempArray[k]] = [tempArray[k], tempArray[i]];
        }
    }

    return tempArray;
}
