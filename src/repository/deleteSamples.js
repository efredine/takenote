import { executeSql } from '../storage';

const DELETE_SAMPLES = `
  DELETE
  FROM notes
  WHERE sample = 1;
`;

const deleteSamples = () => tx => {
  return executeSql(tx, DELETE_SAMPLES, []);
};

export default deleteSamples;
