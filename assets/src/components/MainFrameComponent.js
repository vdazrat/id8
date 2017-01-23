/*
Component for mainFrame 
Components need to be pure functions, implement the same as one
*/
import React, { PropTypes } from 'react'
import NewDatasetContainer from '../containers/NewDatasetContainer'
import NewDashBoardContainer from '../containers/NewDashBoardContainer'
import {DashBoardViewComponent,DashBoardEditComponent} from './DashBoardComponent'
import OverviewComponent from './OverviewComponent'



/*
MainFrameComponent,
accepts the mainFrame prop and generates the main frame
mainFrame is defined as folows:
mainFrame:{
	displaying:"dashboards",
	data:{
	    title:"title name",
	    cells: [...]
	}
}
*/
const MainFrameComponent = ({mainFrame})=>{
    switch(mainFrame.displaying){

    	case "Dashboards":{
    		// check if dashboards is still being fetched
    		if(mainFrame.isFetching){
    			return(
    			<div>Fetching...</div>
    			);
    		}
    	    return (
    	    	<DashBoardEditComponent data={mainFrame.data}/>
    	    	);
    	}
        case "New Dataset":{
            return <NewDatasetContainer />;
        }
        case "New DashBoard":{
            return <NewDashBoardContainer />;
        }
    	case "Overview":{
    		return <OverviewComponent />;
    	}
    	default: return <div />;
    }
}


export default MainFrameComponent;