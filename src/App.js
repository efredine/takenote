import React, { useRef } from 'react';
import './App.css';
import './components/Notes';
import Notes from './components/Notes';
import DeleteSamples from './components/DeleteSamples';

function App() {
  const refreshHandler = useRef();
  return (
    <div className="App">
      <header className="App-header">
        <div>Notes</div>
        <DeleteSamples
          onReload={() => {
            if (refreshHandler.current) {
              refreshHandler.current();
            }
          }}
        />
      </header>
      <main>
        <Notes refreshHandler={refreshHandler} />
      </main>
    </div>
  );
}

export default App;
