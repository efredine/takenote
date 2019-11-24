import { executeSql } from './index';

const INSERT_NOTE = `
  INSERT INTO notes (created, updated, title, content)
  VALUES(strftime('%s','now'), strftime('%s','now'), ?, ?);
`;

const insertNote = ({ title, content }) => tx => {
  console.log({ title, content, tx });
  return executeSql(tx, INSERT_NOTE, [title, content]);
};

export default insertNote;
