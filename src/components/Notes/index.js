import React, { useReducer } from 'react';
import usePrevious from '../../hooks/usePrevious';
import queryNotes from '../../repository/queryNotes';
import Table from './Table';
import GiveMeDataButton from './GiveMeDataButton';
import Dialog from '../../components/Dialog';
import { useRepositoryQuery } from '../../repository';

function getRows(result) {
  const rowSet = result && result.rows ? result.rows : [];
  const rows = [];
  for (const row of rowSet) {
    rows.push(row);
  }
  return rows;
}

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
}

export default function Notes({ refreshHandler }) {
  const { result, loading, refetch } = useRepositoryQuery(queryNotes());
  const [modalState, dispatchModalState] = useReducer(reducer, {
    open: false,
  });
  const resultRows = getRows(result);
  const prevRows = usePrevious(resultRows);
  const rows = loading ? prevRows : resultRows;

  if (refreshHandler) {
    refreshHandler.current = refetch;
  }
  return (
    <>
      <Table
        rows={rows}
        refetch={refetch}
        dispatchModalState={dispatchModalState}
      />
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
    </>
  );
}
