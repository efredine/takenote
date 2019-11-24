import React from 'react';
import queryNotes from '../../repository/queryNotes';
import GiveMeDataButton from './GiveMeDataButton';
import DeleteButton from './DeleteButton';
import { useRepositoryQuery } from '../../repository';
import './Table.css';

export default function Notes({ refreshHandler }) {
  const { result, error, loading, refetch } = useRepositoryQuery(queryNotes());
  const rows = result && result.rows ? result.rows : [];
  if (refreshHandler) {
    refreshHandler.current = refetch;
  }
  function formatRows(rowList) {
    const rows = [];
    for (const { rowid, title, content } of rowList) {
      rows.push(
        <Row
          key={rowid}
          rowid={rowid}
          title={title}
          content={content}
          refetch={refetch}
        />,
      );
    }
    return rows;
  }
  return (
    <div>
      <table className="Table">
        <thead>
          <tr>
            <th scope="col" className="ActionColumn"></th>
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
      {!loading && result && result.rows.length === 0 && (
        <GiveMeDataButton onReload={refetch} />
      )}
    </div>
  );
}

function Row({ rowid, title, content, refetch }) {
  return (
    <tr>
      <td>
        <button>Edit</button>
        <DeleteButton rowid={rowid} onDelete={refetch} />
      </td>
      <td>{title}</td>
      <td className="ContentData">{content}</td>
    </tr>
  );
}
