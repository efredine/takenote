import React from 'react';
import DeleteButton from './DeleteButton';

function Row({ rowid, title, content, refetch, dispatchModalState }) {
  return (
    <tr>
      <td>
        <button
          onClick={() =>
            dispatchModalState({
              type: 'open',
              rowid,
              title,
              content,
            })
          }
        >
          Edit
        </button>
        <DeleteButton rowid={rowid} onDelete={refetch} />
      </td>
      <td>{title}</td>
      <td className="ContentData">{content}</td>
    </tr>
  );
}

export default React.memo(Row);
