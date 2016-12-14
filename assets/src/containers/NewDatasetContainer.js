import {connect} from 'react-redux'
import NewDatasetComponent from '../components/NewDatasetComponent'
import {submitForm} from '../actions'
import {submitDatasetFormSuccess,submitFormFail} from '../actions'


const mapDispatchToProps = (dispatch) =>{

	return {
		onFormSubmit: (data,action,onSuccess,onFailure)=>{
			dispatch(submitForm(data,action,onSuccess,onFailure));
		},
		onSuccess: (data)=>{
             dispatch(submitDatasetFormSuccess(data));
		},
		onFailure: (response)=>{
             dispatch(submitFormFail(response));
		}
	};
}

const mapStateToProps = (state) =>{

	return {
		  submitted:state.mainFrame.submitted,
		  isFetching:state.mainFrame.isFetching,
		  success:state.mainFrame.success
		};
	
}

const NewDatasetContainer = connect(mapStateToProps,
	                                mapDispatchToProps
	                           )(NewDatasetComponent);

export default NewDatasetContainer;