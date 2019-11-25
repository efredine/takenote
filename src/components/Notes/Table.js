import React from 'react';
import Row from './Row';
import './Table.css';

export default function Table(props) {
  const { rows, refetch, dispatchModalState } = props;
  return (
    <table className="Table">
      <thead>
        <tr>
          <th scope="col" className="ActionColumn">
            <button onClick={() => dispatchModalState({ type: 'open' })}>
              Add...
            </button>
          </th>
          <th scope="col" className="TitleColumn">
            Title
          </th>
          <th scope="col" className="ContentColumn">
            Content
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ rowid, updated, title, content }) => (
          <Row
            key={rowid.toString()}
            rowid={rowid}
            title={title}
            content={content}
            refetch={refetch}
            dispatchModalState={dispatchModalState}
          />
        ))}
      </tbody>
    </table>
  );
}
