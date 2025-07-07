import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a search input value.
 *
 * @param input - The raw input string to debounce
 * @param delay - Delay in ms (default: 300ms)
 * @returns debouncedValue
 */
export function useDebouncedSearch<T = string>(input: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(input), delay);
    return () => clearTimeout(handler);
  }, [input, delay]);

  return debouncedValue;
}
