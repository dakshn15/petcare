import { useState, useEffect, useCallback } from 'react';

export default function useFetch(apiCall, deps = [], options = {}) {
  const { immediate = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall(...args);
      if (res?.success) {
        setData(res.data ?? res);
      } else {
        setData(res);
      }
      return res;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch, execute };
}
