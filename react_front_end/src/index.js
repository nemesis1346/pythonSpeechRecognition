import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import { createStore, applyMiddleware, compose } from 'redux';

const store = createStore(
    rootReducer,
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
