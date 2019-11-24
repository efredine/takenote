import React from 'react';
import { useDatabase } from './storage';
import './App.css';
import './components/Notes';
import Notes from './components/Notes';

function App() {
  const { loading, db, error } = useDatabase();
  console.log({ loading, db, error });
  return (
    <div className="App">
      <header className="App-header">Notes</header>
      <main>
        <Notes />
      </main>
    </div>
  );
}

export default App;
