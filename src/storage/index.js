import { useEffect, useState } from 'react';

const DB_NAME = 'takenote';
const VERSION = '1.0';
const DESCRIPTION = 'Offline book marked pages';
const DEFAULT_SIZE = 5 * 1024 * 1024;

const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS notes (
    created INTEGER NOT NULL,
    updated INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  );
`;

const useDatabase = () => {
  const [db, setDb] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const createTables = tx => {
    console.log('Creating tables');
    tx.executeSql(
      CREATE_TABLES,
      [],
      (_, result) => {
        setLoading(false);
        console.log('prepared tables', result);
      },
      e => setError(e),
    );
  };

  useEffect(() => {
    const db = openDatabase(DB_NAME, VERSION, DESCRIPTION, DEFAULT_SIZE, db => {
      setLoading(true);
      db.version === ''
        ? db.transaction(createTables)
        : db.changeVersion(db.version, VERSION, createTables, e => setError(e));
    });
    setDb(db);
  }, [setDb, setError, setLoading]);

  return { loading, db, error };
};

export { useDatabase };
