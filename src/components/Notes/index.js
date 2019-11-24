import React from 'react';
import faker from 'faker';
import insertNote from '../../repository/insertNote';
import { useRepository, insertRows } from '../../repository';

export default function Notes() {
  const { mutateWith, result, error, loading } = useRepository(insertRows);
  console.log({ result, error, loading, mutateWith });

  function handleClick() {
    const rows = [];
    for (let i = 0; i < 60; i++) {
      rows.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraphs(),
      });
    }
    mutateWith({
      rows,
      insertWith: insertNote,
    });
  }

  return (
    <div>
      <div>Notes</div>
      <button onClick={handleClick}>Give Me Data</button>
    </div>
  );
}
