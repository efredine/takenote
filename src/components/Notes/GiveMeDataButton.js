import React from 'react';
import faker from 'faker';
import insertNote from '../../repository/insertNote';
import { useRepositoryMutation, processRows } from '../../repository';

export default function GiveMeDataButton() {
  const { transactWith, result, error, loading } = useRepositoryMutation(
    processRows,
  );
  console.log({ result, error, loading, transactWith });

  function handleClick() {
    const rows = [];
    for (let i = 0; i < 60; i++) {
      rows.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraphs(),
      });
    }
    transactWith({
      rows,
      rowAction: insertNote,
    });
  }
  return <button onClick={handleClick}>Give Me Data</button>;
}
