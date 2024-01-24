import React from 'react';
// import ForceDirectedGraph from './ForceDirectedGraph';
// import logo from './logo.svg';
import BarChart from './barchart';
import ForceGraphDAG from './chart';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {/* <BarChart /> */}
        {/* <ForceDirectedGraph/> */}
        <div className="Chart">
        <ForceGraphDAG />
        </div>
      </header>
    </div>
  );
}

export default App;