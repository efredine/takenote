import React from 'react';
import faker from 'faker';
import insertNote from '../../repository/insertNote';
import useTriggerWhenLoaded from '../../hooks/useTriggerWhenLoaded';
import { useRepositoryMutation, processRows } from '../../repository';

export default function GiveMeDataButton({ onReload }) {
  const { transactWith, result, error, loading } = useRepositoryMutation(
    processRows,
  );
  const { setLoading } = useTriggerWhenLoaded(result, onReload);
  console.log({ result, error, loading, transactWith });

  function handleClick() {
    const rows = [];
    for (let i = 0; i < 60; i++) {
      rows.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraphs(),
        sample: 1,
      });
    }
    transactWith({
      rows,
      rowAction: insertNote,
    });
    setLoading(true);
  }
  return (
    <button onClick={handleClick} disabled={loading}>
      Give Me Data
    </button>
  );
}
