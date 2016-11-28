import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux'
import SideMenuContainer from './containers/SideMenuContainer';
import {sideMenu,mainReducer} from './reducers'


let store = createStore(mainReducer);
// just to test functions, remove later.
window.mainReducer = mainReducer;
window.store= store;


render(<Provider store={store}><SideMenuContainer /></Provider>, document.getElementById('sidemenu'));
