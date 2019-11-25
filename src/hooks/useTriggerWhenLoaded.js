import { useState, useEffect } from 'react';

export default function useTriggerWhenLoaded(
  ready,
  callback,
  dependencies = [],
) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading && ready) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, setLoading, ready, callback, ...dependencies]);
  return { setLoading };
}
