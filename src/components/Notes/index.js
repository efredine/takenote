import React from 'react';
import queryNotes from '../../repository/queryNotes';
import GiveMeDataButton from './GiveMeDataButton';
import { useRepositoryQuery } from '../../repository';
import './Table.css';

export default function Notes() {
  const { result, error, loading } = useRepositoryQuery(queryNotes());
  const rows = result && result.rows ? result.rows : [];

  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th scope="col" className="IdColumn">
              Id
            </th>
            <th scope="col" className="TitleColumn">
              Title
            </th>
            <th scope="col" className="ContentColumn">
              Content
            </th>
          </tr>
        </thead>
        <tbody>{formatRows(rows)}</tbody>
      </table>
      {!loading && result && result.rows.length === 0 && <GiveMeDataButton />}
    </div>
  );
}

function formatRows(rowList) {
  const rows = [];
  for (const { rowid, title, content } of rowList) {
    rows.push(<Row key={rowid} id={rowid} title={title} content={content} />);
  }
  return rows;
}

function Row({ id, title, content }) {
  return (
    <tr>
      <td>{id}</td>
      <td>{title}</td>
      <td className="ContentData">{content}</td>
    </tr>
  );
}
