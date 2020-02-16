import React from 'react';
import MicPage from './components/pages/MicPage.js'
import ReactMicOriginalPage from './components/pages/react_mic_original.js'
import NavBar from './components/navigation/NavBar';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar></NavBar>
        <Route path="/custom" exact component={MicPage}></Route>
        <Route path="/original" component={ReactMicOriginalPage}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;

