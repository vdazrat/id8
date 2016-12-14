import {connect} from 'react-redux'
import NewDashBoardComponent from '../components/NewDashBoardComponent'
import {submitForm} from '../actions'
import {submitDashboardFormSuccess,submitFormFail} from '../actions'



const mapStateToProps = (state) =>{

	// This requires the datasets, so fetch it from the state.sidemenu
    let datasets = state.sideMenu.sideMenuItems.filter((v)=>(v.name === "Datasets"))[0];

	return {
		  submitted:state.mainFrame.submitted,
		  isFetching:state.mainFrame.isFetching,
		  success:state.mainFrame.success,
		  datasets:datasets.subItems
		};
	
}

const mapDispatchToProps = (dispatch) =>{

	return {
		onFormSubmit: (data,action,onSuccess,onFailure)=>{
			dispatch(submitForm(data,action,onSuccess,onFailure));
		},
		onSuccess: (data)=>{
             dispatch(submitDashboardFormSuccess(data));
		},
		onFailure: (response)=>{
             dispatch(submitFormFail(response));
		}
	};
}

const NewDashBoardContainer = connect(mapStateToProps,
	                                  mapDispatchToProps
	                           )(NewDashBoardComponent);

export default NewDashBoardContainer;