/*
MainFrameContainer 
This is a container as it fetches the data from the server and maps the state to the props
*/

import {connect} from 'react-redux';
import {fetchDashBoard} from '../actions';
import MainFrameComponent from '../components/MainFrameComponent';

const mapStateToProps = (state)=> {
	
    return {
        mainFrame: state.mainFrame
    };

}

const MainFrameContainer = connect(
  mapStateToProps
)(MainFrameComponent);



export default MainFrameContainer;