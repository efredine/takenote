import React, { useReducer } from 'react';
import queryNotes from '../../repository/queryNotes';
import GiveMeDataButton from './GiveMeDataButton';
import DeleteButton from './DeleteButton';
import Dialog from '../../components/Dialog';
import { useRepositoryQuery } from '../../repository';
import './Table.css';

export default function Notes({ refreshHandler }) {
  const { result, error, loading, refetch } = useRepositoryQuery(queryNotes());
  const [modalState, dispatchModalState] = useReducer(
    function reducer(state, action) {
      switch (action.type) {
        case 'open':
          const { rowid, title, content } = action;
          return { open: true, rowid, title, content };
        case 'close':
          return { open: false };
        default:
          throw new Error();
      }
    },
    {
      open: false,
    },
  );
  console.log({ modalState });
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
          dispatchModalState={dispatchModalState}
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
        <tbody>{formatRows(rows)}</tbody>
      </table>
      {!loading && result && result.rows.length === 0 && (
        <GiveMeDataButton onReload={refetch} />
      )}
      {modalState.open && (
        <Dialog
          rowid={modalState.rowid}
          title={modalState.title}
          content={modalState.content}
          onClose={updated => {
            if (updated) {
              refetch();
            }
            dispatchModalState({ type: 'close' });
          }}
        />
      )}
    </div>
  );
}

function Row({ rowid, title, content, refetch, dispatchModalState }) {
  function EditButton() {
    return (
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
    );
  }
  return (
    <tr>
      <td>
        <EditButton />
        <DeleteButton rowid={rowid} onDelete={refetch} />
      </td>
      <td>{title}</td>
      <td className="ContentData">{content}</td>
    </tr>
  );
}
