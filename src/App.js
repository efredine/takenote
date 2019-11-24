import React, { useRef } from 'react';
import './App.css';
import './components/Notes';
import Notes from './components/Notes';
import DeleteSamples from './components/DeleteSamples';

function App() {
  const refreshHandler = useRef();
  function handleRefresh() {
    if (refreshHandler.current) {
      refreshHandler.current();
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <div>Notes</div>
        <DeleteSamples onReload={handleRefresh} />
        <button onClick={handleRefresh}>Refresh</button>
      </header>
      <main>
        <Notes refreshHandler={refreshHandler} />
      </main>
    </div>
  );
}

export default App;
