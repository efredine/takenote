import React from 'react';
import deleteSamples from '../repository/deleteSamples';
import { useRepositoryMutation } from '../repository';

export default function DeleteSamples() {
  const { transactWith, result, error, loading } = useRepositoryMutation(
    deleteSamples,
  );
  console.log('delete', { transactWith, result, error, loading });
  function handleClick() {
    console.log('clicked delete samples');
    transactWith(true);
  }
  return (
    <button onClick={handleClick} disabled={loading}>
      Delete Samples
    </button>
  );
}
