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
	return Object.assign({},{
		selected:selected},
		{type:"CLICK_SIDEMENU_ITEM"});
}