import {connect} from 'react-redux'
import DashBoardModalComponent from '../components/DashBoardModalComponent'
import {submitForm} from '../actions'
import {submitCellSuccess, submitCellFail,submitCellRequest} from '../actions'
import {fetchHead} from '../actions'



const mapStateToProps = (state) =>{

	return{
		dashboard: state.mainFrame.data.api,
		head:state.mainFrame.head
	};
}

const mapDispatchToProps = (dispatch) =>{

	return {
		onFormSubmit: (data,action,onSuccess,onFailure)=>{
			dispatch(submitCellRequest(data,action,onSuccess,onFailure));
		},
		onSuccess: (data)=>{
             dispatch(submitCellSuccess(data));
		},
		onFailure: (response)=>{
             dispatch(submitCellFail(response));
		}, 
		onLoad: function(){
			$('.modal').on('hidden.bs.modal', function(){
				    $('.submit-error').hide();
				    let form = $(this).find('form')[0];
				    if(form !== undefined){
				      form.reset();
				    }
				});
		},
        fetchHead: function(api){
              dispatch(fetchHead(api));
        }
	};
}


const DashBoardModalContainer = connect(mapStateToProps,
	                                mapDispatchToProps
	                           )(DashBoardModalComponent);

export default DashBoardModalContainer;