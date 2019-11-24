import React, { useState, useEffect } from 'react';
import deleteSamples from '../repository/deleteSamples';
import { useRepositoryMutation } from '../repository';

export default function DeleteSamples({ onReload }) {
  const { transactWith, result, error, loading } = useRepositoryMutation(
    deleteSamples,
  );
  const [reloading, setReloading] = useState(false);
  useEffect(() => {
    if (reloading && result) {
      onReload();
    }
  }, [reloading, setReloading, result, onReload]);
  console.log('delete', { transactWith, result, error, loading });
  function handleClick() {
    transactWith(true);
    setReloading(true);
  }
  return (
    <button onClick={handleClick} disabled={loading}>
      Delete Samples
    </button>
  );
}
