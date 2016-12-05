/*
Component for mainFrame 
Components need to be pure functions, implement the same as one
*/
import React, { PropTypes } from 'react'
import CellComponent from './CellComponent'

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
    	    	<DashBoardViewComponent data={mainFrame.data}/>
    	    	);
    	}
    	case "overview":{
    		return <div />;
    	}
    	default: return <div />;
    }
}

const DashBoardViewComponent = ({data}) => {
    // Get the data.cells
    let cells = data.cells.map((cell,i)=>(<CellComponent  key={"cell-"+i} cellKey={"cell-"+i} {...cell}/>));
    return(
    	   <div>
    	      <div className="page-header">
                <h1>{data.title}</h1>
              </div>
              {cells}
           </div>
    	);

}

export default MainFrameComponent;