import React from 'react';
import './App.css';
import ReactMicCustomPage from './components/pages/react_mic_custom.js'
import { BrowserRouter ,Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route path="/" exact component={ReactMicCustomPage}></Route>
    </div>
  </BrowserRouter>
  );
}

export default App;

