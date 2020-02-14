import React from 'react';
import './App.css';
import ReactMicCustomPage from './components/pages/react_mic_custom.js'
import ReactMicOriginalPage from './components/pages/react_mic_original.js'

import { BrowserRouter ,Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route path="/custom" exact component={ReactMicCustomPage}></Route>
      <Route path="/original" exact component={ReactMicOriginalPage}></Route>

    </div>
  </BrowserRouter>
  );
}

export default App;

