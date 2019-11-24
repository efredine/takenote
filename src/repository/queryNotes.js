import { executeSql } from '../storage';

const QUERY_NOTES = `
  SELECT rowid, created, updated, title, content
  FROM notes;
`;

const queryNotes = () => tx => {
  console.log('queryNote', { tx });
  return executeSql(tx, QUERY_NOTES, []);
};

export default queryNotes;
