/*
Contains all the actions and action creators
An action creator is a pure funcion that accepts a data and
returns an action.
*/


/*
addSideMenuItems 
expects data with name and an array subItems.
*/
export const ADD_SIDEMENU_SUBITEM = "ADD_SIDEMENU_SUBITEM";
export const addSideMenuItem = (data) =>{

	return Object.assign({},{name:data.name,
		                     subItems:data.subItems},
		                     {type:"ADD_SIDEMENU_ITEM"});

}
/*
this action is dispatched on sidemenuitem click
*/
export const CLICK_SIDEMENU_ITEM = "CLICK_SIDEMENU_ITEM"
export const clickSideMenuItem = (data) =>{
    let selected = {};
    selected.name = data.name;
    if(data.hasOwnProperty('subItem')){
    	selected.subItem = data.subItem;
    }
	return {
		selected:selected,
		type:CLICK_SIDEMENU_ITEM};
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
		// A new dashboard creation action
		if(data.subItem === "new"){
		  dispatch(fetchNewDashBoard());
	   }
       else{
		dispatch(fetchDashBoard({
			displaying:data.name,
			api:data.api
				}));
	  }
	}
	// dispatch fetching of the overview 
	if(data.name === "Overview"){
		dispatch(fetchOverview());
	}
	// dispatch fetching of datasets
	if(data.name === "Datasets"){

		// A new dataset creation action
		if(data.subItem === "new"){
		dispatch(fetchNewDataset());
	   } // else..
	}
			
 };

}


/*
Dashboard action creators
*/

export const FETCH_DASHBOARD_REQUEST = 'FETCH_DASHBOARD_REQUEST';
export const FETCH_DASHBOARD_SUCCESS = 'FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_FAIL = 'FETCH_DASHBOARD_FAIL';
export const FETCH_NEW_DASHBOARD_FORM = 'FETCH_NEW_DASHBOARD_FORM';

const fetchNewDashBoard = (data) =>(
      {type:FETCH_NEW_DASHBOARD_FORM,
	   displaying:'New DashBoard'}
	)

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
new dashboard action creators
*/

export const FETCH_NEW_DATASET_FORM = 'FETCH_NEW_DATASET_FORM';
export const fetchNewDataset = (data) =>{

	return {type:FETCH_NEW_DATASET_FORM,
		    displaying:'New Dataset'};
}

/*
Cell action creators 
*/
export const FETCH_CELL_REQUEST = 'FETCH_CELL_REQUEST';
export const FETCH_CELL_SUCCESS = 'FETCH_CELL_SUCCESS';
export const FETCH_CELL_FAIL = 'FETCH_CELL_FAIL';
export const APPEND_NEW_CELL = 'APPEND_NEW_CELL';
export const SUBMIT_CELL_SUCCESS = 'SUBMIT_CELL_SUCCESS';
export const SUBMIT_CELL_REQUEST = 'SUBMIT_CELL_REQUEST';
export const SET_CELL_REQUEST = 'SET_CELL_REQUEST';

export const setCellRequest = () => {
	return{type:SET_CELL_REQUEST};
}
export function submitCellRequest(data,action,onSuccess,onFailure){
/*
data is form data, action is the url for the post
*/
    return function(dispatch){
        dispatch(setCellRequest());

        // Make a POST request witht the action
       $.ajax({
		  url: action,
		  data: data.formData,
		  processData: false,
		  contentType: false,
		  type: 'POST',
		  success: onSuccess,
          error: onFailure
		});
    }

}


export const submitCellSuccess = (data)=>{
/*
  When a new cell is being created, this is the action

  SUBMIT_CELL_SUCCESS and FAIL should set a state, and set this prop 
  to the container, this way the form fields will automatically get cleared.
*/

	return [{
		payload:data.payload,
		api:data.api,
		type:APPEND_NEW_CELL
	},
	{
		type:SUBMIT_CELL_SUCCESS
	}];
}

export const SUBMIT_CELL_FAIL = 'SUBMIT_CELL_FAIL';
export const submitCellFail = (data)=>{
	return{
		type: SUBMIT_CELL_FAIL
	};
}


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


/*
Submitting of forms:
*/
export const SUBMIT_FORM_REQUEST = 'SUBMIT_FORM_REQUEST';
export const SUBMIT_FORM_SUCCESS = 'SUBMIT_FORM_SUCCESS';
export const SUBMIT_FORM_FAIL = 'SUBMIT_FORM_FAIL';

const submitFormRequest = ()=>({type:SUBMIT_FORM_REQUEST});
export const submitFormSuccess = ()=>({type:SUBMIT_FORM_SUCCESS});
export const submitFormFail = ()=>({type:SUBMIT_FORM_FAIL});

export function submitForm(data,action,onSuccess,onFailure){
/*
data is form data, action is the url for the post
*/
    return function(dispatch){
        dispatch(submitFormRequest());

        // Make a POST request witht the action
       $.ajax({
		  url: action,
		  data: data.formData,
		  processData: false,
		  contentType: false,
		  type: 'POST',
		  success: onSuccess,
          error: onFailure
		});
    }

}

/*
Dataset form success actions
*/
export const SUBMIT_DATASET_FORM_SUCCESS = 'SUBMIT_DATASET_FORM_SUCCESS';
export const submitDatasetFormSuccess = (data)=>(
[{
	type:ADD_SIDEMENU_SUBITEM,
	name:'Datasets',
	subItem:{title:data.name,api:data.api}
	
},
{
	type:SUBMIT_DATASET_FORM_SUCCESS
	
}
]);


/*
Dashboard form success actions
*/
export const SUBMIT_DASHBOARD_FORM_SUCCESS = 'SUBMIT_DASHBOARD_FORM_SUCCESS';
export const submitDashboardFormSuccess = (data)=>(
[{
	type:ADD_SIDEMENU_SUBITEM,
	name:'Dashboards',
	subItem:{title:data.title,api:data.api}
	
},
{
	type:SUBMIT_DASHBOARD_FORM_SUCCESS
	
}
]);

/*
actions for fetching dataset head
*/

export const FETCH_HEAD_REQUEST = 'FETCH_HEAD_REQUEST';
export const FETCH_HEAD_SUCCESS = 'FETCH_HEAD_SUCCESS';
export const fetchHead = (api)=>{

		return function(dispatch){

		          $.get(api+"?format=json",function(jsonStr){
		                 dispatch(recieveHead(JSON.parse(jsonStr.replace(/&quot;/g,'"'))));
		         });
		   }
}
export const recieveHead = (json)=>{
    return{
    	type:FETCH_HEAD_SUCCESS,
    	head:json
    }
}


