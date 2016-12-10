/*
SideMenuContainer for the sidemenu
This is a container as it fetches the data from the server and maps the state to the props
*/

import {connect} from 'react-redux';
import SideMenuComponent from '../components/SideMenuComponent';
import {addSideMenuItem,sideMenuClick,clickSideMenuItem} from '../actions';
import {fetchDashBoard,fetchOverview} from '../actions';


/*
mapStateToProps
*/
const mapStateToProps = (state)=> {
	let items = [];
	if(Object.keys(state.sideMenu).length !== 0){
          items = state.sideMenu.sideMenuItems;
	}
    return {
        sideMenuItems:items,
        selected:state.sideMenu.selected
    };

}

const mapDispatchToProps = (dispatch)=>{
	return{
		onClick: (data)=>{
			dispatch(sideMenuClick(data));
			
		},
		onAdd: (data)=>{
			dispatch(sideMenuClick(data));
		}
	};
}

/*
sideMenuContainer is the container
*/

let SideMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps 
)(SideMenuComponent);



export default SideMenuContainer;
