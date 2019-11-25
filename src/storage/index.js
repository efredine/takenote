import { useEffect, useState } from 'react';

const DB_NAME = 'takenote';
const VERSION = '1.0';
const DESCRIPTION = 'Offline notes';
const DEFAULT_SIZE = 5 * 1024 * 1024;

const CREATE_NOTES = `
  CREATE TABLE IF NOT EXISTS notes (
    created INTEGER NOT NULL,
    updated INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sample INTEGER NOT NULL
  );
`;
function transaction(db) {
  return new Promise((resolve, reject) => {
    db.transaction(resolve, reject);
  });
}

function readTransaction(db) {
  return new Promise((resolve, reject) => {
    db.readTransaction(resolve, reject);
  });
}

function changeVersion(db, prevVersion, newVersion) {
  console.log('changing version', prevVersion, newVersion);
  return new Promise((resolve, reject) => {
    db.changeVersion(prevVersion, newVersion, resolve, reject);
  });
}

function executeSql(tx, sql, parameters) {
  console.log('executing', { tx, sql, parameters });
  return new Promise((resolve, reject) => {
    tx.executeSql(
      sql,
      parameters,
      (tx, result) => resolve({ tx, result }),
      reject,
    );
  });
}

const useDatabase = () => {
  const [db, setDb] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const createTables = tx => {
    console.log('Creating tables');
    return executeSql(tx, CREATE_NOTES, []);
  };

  useEffect(() => {
    const db = openDatabase(DB_NAME, '', DESCRIPTION, DEFAULT_SIZE, db => {
      setLoading(true);
      const dbTransaction =
        db.version === ''
          ? transaction(db)
          : changeVersion(db, db.version, VERSION);
      dbTransaction
        .then(createTables)
        .then(() => setLoading(false))
        .catch(e => {
          console.error(e);
          setError(e);
        });
    });
    setDb(db);
  }, [setDb, setError, setLoading]);

  return { loading, db, error };
};

export { useDatabase, executeSql, transaction, readTransaction };
