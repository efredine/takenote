import React, { useCallback } from 'react';
import useTriggerWhenLoaded from '../../hooks/useTriggerWhenLoaded';
import { useRepositoryMutation } from '../../repository';
import deleteNote from '../../repository/deleteNote';

export default function DeleteButton({ rowid, onDelete }) {
  const { transactWith, result, loading } = useRepositoryMutation(deleteNote);
  const { setLoading } = useTriggerWhenLoaded(result, onDelete);
  const handleClick = useCallback(() => {
    transactWith({ rowid });
    setLoading(true);
  }, [rowid, setLoading, transactWith]);
  return (
    <button onClick={handleClick} disabled={loading}>
      Delete
    </button>
  );
}
