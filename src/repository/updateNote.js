import { executeSql } from '../storage';

const UPDATE_NOTE = `
  UPDATE NOTES
  SET   updated = strftime('%s','now'),
        title = ?,
        content = ?
  WHERE 
    rowid = ?;
`;

export default function updateNote({ title, content, rowid }) {
  return tx => executeSql(tx, UPDATE_NOTE, [title, content, rowid]);
}
