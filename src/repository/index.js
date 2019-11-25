import { useCallback, useReducer } from 'react';
import { useDatabase, transaction, readTransaction } from '../storage';

const processRows = ({ rows, rowAction }) => tx => {
  const accumulatedResults = [];
  return rows
    .reduce(async (previousPromise, nextRow) => {
      await previousPromise;
      return rowAction(nextRow)(tx).then((tx, result) => {
        accumulatedResults.push(result);
        return { tx, accumulatedResults };
      });
    }, Promise.resolve)
    .then((tx, _) => ({ tx, result: accumulatedResults }));
};

function withValidDatabase({ db, loading, error }, callback) {
  if (error) {
    return { error };
  }
  if (loading || !db) {
    return { loading };
  }
  return callback(db);
}

function queryReducer(state, action) {
  switch (action.type) {
    case 'refetch':
      if (state.loading) {
        return state;
      }
      return {
        start: true,
        loading: false,
      };
    case 'initiate':
      return {
        loading: true,
      };
    case 'result':
      return {
        loading: false,
        result: action.result,
      };
    case 'error':
      return {
        loading: false,
        error: action.error,
      };
    default:
      throw new Error();
  }
}

function useRepositoryQuery(query) {
  const [state, dispatch] = useReducer(queryReducer, {
    start: true,
    loading: false,
  });
  const refetch = useCallback(() => dispatch({ type: 'refetch' }), [dispatch]);
  return withValidDatabase(useDatabase(), db => {
    if (state.start) {
      dispatch({ type: 'initiate' });
      readTransaction(db)
        .then(tx => query(tx))
        .then(({ tx, result }) => {
          dispatch({ type: 'result', result });
        })
        .catch(error => dispatch({ type: 'error', error }));
    }
    return { ...state, refetch };
  });
}

function mutationReducer(state, action) {
  switch (action.type) {
    case 'fetch':
      if (state.loading) {
        return state;
      }
      return {
        txData: action.txData,
        loading: false,
      };
    case 'initiate':
      return {
        ...state,
        loading: true,
      };
    case 'result':
      return {
        loading: false,
        result: action.result,
      };
    case 'error':
      return {
        loading: false,
        error: action.error,
      };
    default:
      throw new Error();
  }
}

function useRepositoryMutation(repositoryFunction) {
  const [state, dispatch] = useReducer(mutationReducer, { loading: false });
  const transactWith = useCallback(
    data => dispatch({ type: 'fetch', txData: data }),
    [dispatch],
  );

  return withValidDatabase(useDatabase(), db => {
    const { txData, loading } = state;
    if (txData && !loading) {
      dispatch({ type: 'initiate' });
      transaction(db)
        .then(tx => repositoryFunction(txData)(tx))
        .then(({ _, result }) => dispatch({ type: 'result', result }))
        .catch(error => dispatch({ type: 'error', error }));
    }
    return { ...state, transactWith };
  });
}

export { useRepositoryQuery, useRepositoryMutation, processRows };
