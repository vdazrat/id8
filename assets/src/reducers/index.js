/*
Module that contains all the reducers for the app.
Separete them later into their own files if the application grows, keeping them
under a single file for now.

Reducers are pure functions, that accept a state and action and return another state

A part of the state can be mapped to a different reducer and all reducers are combined in the 
mainReducer.

Each reducer is named the same as the property name in the state
*/
import { combineReducers } from 'redux'
import { FETCH_DASHBOARD_REQUEST,FETCH_DASHBOARD_SUCCESS } from '../actions'
import { FETCH_OVERVIEW } from '../actions'
import { FETCH_CELL_REQUEST, FETCH_CELL_SUCCESS} from '../actions'




/*
Define the initialState
Get this value from __INITIAL_DATA__
*/
const initialState = window.__INITIAL_DATA__;



/*
sideMenu
This reducer is for the sidemenu bar. 
the sideMenu part of the state looks like this
sideMenu : {
	sideMenuItems: [{name:"Dashboards",subItems:["CPM","Bugdb"]},
	        {name:"profile"}
	]
}
*/
export const sideMenu = (state,action) => {
    if(typeof state === 'undefined'){
    	return {sideMenuItems:initialState.sideMenu.sideMenuItems,
    	        selected:initialState.sideMenu.selected};
    }
    switch(action.type){

    	case "ADD_MENU_ITEM":{
          return Object.assign({},state,
          	{sideMenuItems:sideMenuItems(state.sideMenuItems,action),
             selected:state.selected});
    	}
    	case "CLICK_SIDEMENU_ITEM":{
    		/*
    		No need to deal with sideMenuItems, only update the selected property
    		*/
       
    		return Object.assign({},state,
    			{selected:action.selected});
    	}
    	default:
    	  return state;
    }

}

const sideMenuItems = (state,action) => {
	if(typeof state === 'undefined'){
		return [];
	}
	switch(action.type){
		case "ADD_MENU_ITEM":{
            return [...state,
            {
            	name: action.name,
            	subItems: action.subItems
            }
            ];
		}
		default:
		    return state;
	}

}


/*
mainFrame reducer:
This reduces the central display area.
The state is as folows:

mainFrame = {
    displaying: "dashboards",
    data: {
        title:"CPM",
        cells:[
         {
           isFetching:false,
           isInvalidated:false,
           api:'http://..'
           payload:{
              cell_type:'TextData',
              ...
           }
         },
         {
            isFetching:True,
            isInvalidated:false,
            api:'http://..',
            payload:{}

         }
        ]
    }
}
*/

const mainFrame = (state,action)=>{
  if(typeof state === 'undefined'){
        return initialState.mainFrame;
    }
    switch(action.type){
       
        case FETCH_DASHBOARD_REQUEST:{
            return Object.assign({},{displaying:action.displaying},{isFetching:true});

        }
        case FETCH_DASHBOARD_SUCCESS:{
             console.log(action);
            return Object.assign({},{displaying:action.displaying,
                                    data:action.data},
                                    {isFetching:false});
        }

        case FETCH_CELL_REQUEST:
        case FETCH_CELL_SUCCESS:{
             return(Object.assign({},state,
                {data:Object.assign({},state.data,{cells:cells(state.data.cells,action)})
            }));
        }

        case FETCH_OVERVIEW:{
             return Object.assign({},{displaying:action.displaying},{isFetching:false});
        }

        default: return state;

    }

}

/*
cells reducer,
for mainFrame.data.cells
cells = {
    isFetching: true,
    payload:{}
}
*/

const cells = (state=[],action) =>{
    switch(action.type){

        case FETCH_CELL_REQUEST:
        case FETCH_CELL_SUCCESS:{
             return state.map((c)=> cell(c,action));

        }
        default: return state;
    }

}

const cell = (state,action) => {
    if(action.api !== state.api){
        // only respond your own cell
        return state;
    }

    switch(action.type){

            case FETCH_CELL_REQUEST:{
                 return {isFetching:true,
                         api:action.api};
            }
            case FETCH_CELL_SUCCESS:{
                 return {isFetching:false,
                         api:action.api,
                         payload:action.payload};

            }
            default: return state;
        }


    }

/*
mainReducer
Combine the reducer for each property in the state tree.
*/

/*
export const mainReducer = combineReducers({
	                sideMenu,
	               
	             }); 
*/

export const mainReducer = (state,action)=>{
    if(typeof state === 'undefined'){
    	return initialState;
    }
    return{
    	sideMenu: sideMenu(state.sideMenu,action),
        mainFrame: mainFrame(state.mainFrame,action)
    };

}
