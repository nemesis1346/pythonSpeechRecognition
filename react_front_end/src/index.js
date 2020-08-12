import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxMulti from 'redux-multi';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as ROUTES from './constants/routes';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, reduxMulti)
);

ReactDOM.render(<Provider store={store}>
   <BrowserRouter basename={ROUTES.ROUTE_BASENAME}><App /></BrowserRouter>    
</Provider>, document.getElementById('root'));
