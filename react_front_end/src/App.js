import React from 'react';
import ReactMicCustomPage from './components/pages/react_mic_custom.js'
import ReactMicOriginalPage from './components/pages/react_mic_original.js'
import NavBar from './components/navigation/NavBar';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar></NavBar>
        <Route path="/custom" exact component={ReactMicCustomPage}></Route>
        <Route path="/original" component={ReactMicOriginalPage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;

