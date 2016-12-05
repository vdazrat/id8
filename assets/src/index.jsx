import React from 'react';
import {render} from 'react-dom';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux'
import SideMenuContainer from './containers/SideMenuContainer';
import MainFrameContainer from './containers/MainFrameContainer';

import {sideMenu,mainReducer} from './reducers'

import MainFrameComponent from './components/MainFrameComponent';

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger()




let store = createStore(mainReducer,
applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
	);
// just to test functions, remove later.
window.mainReducer = mainReducer;
window.store= store;


render(<Provider store={store}><SideMenuContainer /></Provider>, document.getElementById('sidemenu'));
render(<Provider store={store}><MainFrameContainer /></Provider>, document.getElementById('mainframe'));

