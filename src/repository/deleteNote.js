import { executeSql } from '../storage';

const DELETE_NOTE = `
  DELETE
  FROM notes
  WHERE rowid = ?;
`;

export default function deleteNote({ rowid }) {
  return tx => executeSql(tx, DELETE_NOTE, [rowid]);
}
