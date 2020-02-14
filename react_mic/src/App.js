import React from 'react';
import './App.css';
import ReactMicPage from './components/pages/react_mic.js'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route path="/" exact component={ReactMicPage}></Route>
    </div>
  </BrowserRouter>
  );
}

export default App;

