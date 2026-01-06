import { useState, useEffect } from 'react';

/**
 * Result returned by {@link useFetch}.
 */
export interface UseFetchResult<T> {
  /** The fetched data, or null if not yet loaded or on error. */
  data: T | null;
  /** Error message if the request failed, or null if successful. */
  error: string | null;
  /** Whether the request is currently in progress. */
  loading: boolean;
}

/**
 * React hook that fetches data from a URL using GET request.
 *
 * @param url - The URL to fetch from. If null/undefined, no request is made.
 * @returns State object containing data, error, and loading status.
 */
export function useFetch<T = unknown>(url: string | null | undefined): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Don't fetch if URL is not provided
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Reset state for new fetch
    setError(null);
    setLoading(true);

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, error, loading };
}