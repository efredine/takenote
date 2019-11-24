import { useState, useCallback } from 'react';
import { useDatabase, transaction, readTransaction } from '../storage';

const processRows = ({ rows, rowAction }) => tx => {
  const results = [];
  return rows
    .reduce(async (previousPromise, nextRow) => {
      await previousPromise;
      return rowAction(nextRow)(tx).then((tx, result) => {
        results.push(result);
        return { tx, results };
      });
    }, Promise.resolve)
    .then((tx, _) => ({ tx, results }));
};

function useRepositoryQuery(query) {
  const { db, loading, error } = useDatabase();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState();
  const [txError, setTxError] = useState();

  if (error) {
    return { error };
  }
  if (loading || !db) {
    return { loading };
  }
  if (!txError && !started) {
    setStarted(true);
    setResult(undefined);
    setTxError(undefined);
    readTransaction(db)
      .then(tx => query(tx))
      .then(({ tx, results }) => {
        console.log('got result', { tx, results });
        setResult(results);
      })
      .catch(setTxError);
  }
  const txLoading = started && !result;
  return { error: txError, loading: txLoading, result };
}

function useRepositoryMutation(repositoryFunction) {
  const { db, loading, error } = useDatabase();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState();
  const [txError, setTxError] = useState();
  const [txData, setTxData] = useState();
  const transactWith = useCallback(
    data => {
      if (!started) {
        setTxData(data);
      }
    },
    [setTxData, started],
  );

  if (error) {
    return { error };
  }
  if (loading || !db) {
    return { loading };
  }
  if (!txError && !started && txData) {
    console.log('starting a transaction');
    setStarted(true);
    setResult(undefined);
    setTxError(undefined);
    transaction(db)
      .then(tx => repositoryFunction(txData)(tx))
      .then(({ _, results }) => setResult(results))
      .catch(setTxError)
      .finally(() => {
        setTxData(undefined);
        setStarted(false);
      });
  }
  const txLoading = started && !result;
  return { error: txError, loading: txLoading, result, transactWith };
}

export { useRepositoryQuery, useRepositoryMutation, processRows };
