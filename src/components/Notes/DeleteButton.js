import React, { useState, useEffect, useCallback } from 'react';
import { useRepositoryMutation } from '../../repository';
import deleteNote from '../../repository/deleteNote';

export default function DeleteButton({ rowid, onDelete }) {
  const { transactWith, result, loading } = useRepositoryMutation(deleteNote);
  const [reloading, setReloading] = useState(false);
  useEffect(() => {
    if (reloading && result) {
      onDelete();
    }
  }, [reloading, setReloading, result, onDelete]);
  const handleClick = useCallback(() => {
    transactWith({ rowid });
    setReloading(true);
  }, [rowid, setReloading, transactWith]);
  return (
    <button onClick={handleClick} disabled={loading}>
      Delete
    </button>
  );
}
