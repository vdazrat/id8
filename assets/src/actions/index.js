/*
Contains all the actions and action creators
An action creator is a pure funcion that accepts a data and
returns an action.
*/


/*
addSideMenuItems 
expects data with name and an array subItems.
*/
export const addSideMenuItem = (data) =>{

	return Object.assign({},{name:data.name,
		                     subItems:data.subItems},
		                     {type:"ADD_SIDEMENU_ITEM"});

}
/*
this action is dispatched on sidemenuitem click
*/
export const clickSideMenuItem = (data) =>{
    let selected = {};
    selected.name = data.name;
    if(data.hasOwnProperty('subItem')){
    	selected.subItem = data.subItem;
    }
	return {
		selected:selected,
		type:"CLICK_SIDEMENU_ITEM"};
}
/*
CHANGE_FRAME action creator
where data = {
	displaying:"dashboards",
	data:{
	  ....
	}
}
*/


/*
Lets create a thunk, for dispatching multiple actions when a sidemenu is clicked
*/
export function sideMenuClick(data){
 // this will be appropriately dispatched by the thunk middleware

 return function(dispatch){

   // dispatch the clicksidemenuItem action
 	dispatch(clickSideMenuItem(data));
 	
   // depending on which item was clicked, dispatch the appropriate action
   
   // dispatch fetching of dashboard data
	if(data.name === "Dashboards"){
		dispatch(fetchDashBoard({
			displaying:data.name,
			api:data.api
				}));
	}
	// dispatch fetching of the overview 
	if(data.name === "Overview"){
		dispatch(fetchOverview());
	}
			
 };

}


/*
Dashboard action creators
*/

export const FETCH_DASHBOARD_REQUEST = 'FETCH_DASHBOARD_REQUEST';
export const FETCH_DASHBOARD_SUCCESS = 'FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_FAIL = 'FETCH_DASHBOARD_FAIL';


const requestDashBoard = (data)=>(
        Object.assign({},
		{type:FETCH_DASHBOARD_REQUEST,
		 displaying:'Dashboards',
	     api:data.api})
	)
const successDashBoard = (data)=>(
          Object.assign({},
				{type:FETCH_DASHBOARD_SUCCESS,
				 displaying:'Dashboards',
			     data:Object.assign({},data)
			    })
	)

function recieveDashBoard(json){
	if(json.id){
		// the cells in json.cells are apis which need to be resolved later.
		// reformat them
		return function(dispatch){
				let cells = json.cells.map((cell)=>{
					return{
						isFetching:true,
						api:cell
					};
				});

                let data = Object.assign({},json,
                            {cells: cells});


                dispatch(successDashBoard(data));
				// need to dispatch fetchCell for all the cells.
			    cells.map((cell)=>{dispatch(fetchCell(cell))});

		}
	}
	return (
	     Object.assign({},
		{type:FETCH_DASHBOARD_FAIL,
		 displaying:'Dashboards'
	     })
	     );
}



// fetchDashBoard is where the data is fetched
export function fetchDashBoard(data){

	return function(dispatch){
        //first dispatch requestDashBoard 
        dispatch(requestDashBoard(data));

        // Next fetch the data from the api

        // return the promise object
        /*
        return fetch(data.api+"?format=json")
                 .then((response) => {
                 	console.log(response.json());
                 	return response.json()})
                 .then((json) => (
                         dispatch(recieveDashBoard(json))
                 	));

         */
         $.get(data.api,function(json){
                 dispatch(recieveDashBoard(json))
         });
	};
}


/*
Overview action creators
*/

export const FETCH_OVERVIEW = 'FETCH_OVERVIEW';
export const fetchOverview = (data) =>{

	return {type:FETCH_OVERVIEW,
		    displaying:'Overview'};
}



/*
Cell action creators 
*/
export const FETCH_CELL_REQUEST = 'FETCH_CELL_REQUEST';
export const FETCH_CELL_SUCCESS = 'FETCH_CELL_SUCCESS';
export const FETCH_CELL_FAIL = 'FETCH_CELL_FAIL';

export const requestCell = (data)=>(
        Object.assign({},
		{type:FETCH_CELL_REQUEST,
	     api:data.api})
	)
const recieveCell = (json)=>{
	if(json.id){
	return{
		type: FETCH_CELL_SUCCESS,
        payload: Object.assign({},json.payload),
        api:json.api
	};
   }
   else{

   	return{
   		type: FETCH_CELL_FAIL
   	}
   }

}
export function fetchCell(data){

   return function(dispatch){
          dispatch(requestCell(data));

          $.get(data.api+"?format=json",function(json){
                 dispatch(recieveCell(Object.assign({},json,{api:data.api})))
         });
   }
}
