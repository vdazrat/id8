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
import update from 'react-addons-update'; // for updating arrays

import { ADD_SIDEMENU_SUBITEM,CLICK_SIDEMENU_ITEM} from '../actions'

import { FETCH_DASHBOARD_REQUEST,FETCH_DASHBOARD_SUCCESS,SUBMIT_DASHBOARD_FORM_SUCCESS } from '../actions' // dashboard actions
import { FETCH_OVERVIEW,FETCH_NEW_DATASET_FORM ,FETCH_NEW_DASHBOARD_FORM} from '../actions'

import { FETCH_CELL_REQUEST, FETCH_CELL_SUCCESS,APPEND_NEW_CELL,SET_CELL_REQUEST} from '../actions' // cell actions
import { SUBMIT_FORM_REQUEST,SUBMIT_FORM_SUCCESS,SUBMIT_FORM_FAIL} from '../actions' // form actions
import { SUBMIT_DATASET_FORM_SUCCESS} from '../actions' // datasetform actions
import { FETCH_HEAD_SUCCESS} from '../actions' // head actions





// only for debugging purposes, remove later
window.update = update;

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
	sideMenuItems: [{name:"Dashboards",
                  subItems:[{title:"CPM",api:"http://.."},{title:"Bugdb",api:"http://.."}],
                  icon:"dashboards",
                  addNew:{title:"New Dashboard"}},  // addNew attribute is for those sidemenu items that have a new form.
	                {name:"profile",
                  subItems:[**this needs to be present for every name, even if there are no subItems**],
                  icon:"profile",  // the icon name is the bootstrap awesome font name
                  }
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

      case ADD_SIDEMENU_SUBITEM:{
           return Object.assign({},state,
            {sideMenuItems:sideMenuItems(state.sideMenuItems,action),
             selected:state.selected});
      }
    	case CLICK_SIDEMENU_ITEM:{
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
    case ADD_SIDEMENU_SUBITEM:{
          // find the submenuitem which has this name
          let stateItem = state.filter((v)=>(v.name === action.name))[0];

          stateItem.subItems.push(action.subItem);
          return state.map((v)=>{
            if(v.name===stateItem.name){
              return stateItem;
            }
            return v;
          });
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
    displaying: "Dashboards", // this value comes from state.sidemenu.sideMenuItems[i].name
    isFetching: false,       // if page is being fetched from ajax
    submitted: false,  // optional - onlny set for new forms
    success:false,     // optional - only set for new forms
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
            
            return Object.assign({},{displaying:action.displaying,
                                    data:action.data},
                                    {isFetching:false});
        }

      
        case APPEND_NEW_CELL:
        case FETCH_CELL_REQUEST:
        case FETCH_CELL_SUCCESS:{
             return(Object.assign({},state,
                {data:Object.assign({},state.data,{cells:cells(state.data.cells,action)})
            }));
        }


        case FETCH_OVERVIEW:{
             return Object.assign({},{displaying:action.displaying},{isFetching:false});
        }

        case FETCH_NEW_DATASET_FORM:{
             return Object.assign({},{displaying:action.displaying},{isFetching:false});
        }
         case FETCH_NEW_DASHBOARD_FORM:{
             return Object.assign({},{displaying:action.displaying},{isFetching:false,submitted:false});
        }

        case SUBMIT_FORM_REQUEST:{
             return Object.assign({},state,{isFetching:true,submitted:false});
        }

        case SUBMIT_FORM_SUCCESS:{
             return Object.assign({},state,{isFetching:false,submitted:true,success:true});
        }

        case SUBMIT_FORM_FAIL:{
             return Object.assign({},state,{isFetching:false,submitted:true,succes:false});
        }

        // from new dataset form actions
        case SUBMIT_DATASET_FORM_SUCCESS:{
             return Object.assign({},state,{isFetching:false,submitted:true,success:true});
        }
         // from new dataset form actions
        case SUBMIT_DASHBOARD_FORM_SUCCESS:{
             return Object.assign({},state,{isFetching:false,submitted:true,success:true});
        }

        case FETCH_HEAD_SUCCESS:{
             return Object.assign({},state,{head:Object.assign({},action.head)});
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
         
        case APPEND_NEW_CELL:{
            return update(state,{$push:[
                             {isFetching:false,
                              payload:action.payload,
                              api:action.api}
                             ]});
            
        }
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
