import { executeSql } from '../storage';

const INSERT_NOTE = `
  INSERT INTO notes (created, updated, title, content, sample)
  VALUES(strftime('%s','now'), strftime('%s','now'), ?, ?, ?);
`;

const insertNote = ({ title, content, sample = 1 }) => tx => {
  console.log({ title, content, tx });
  return executeSql(tx, INSERT_NOTE, [title, content, sample]);
};

export default insertNote;
