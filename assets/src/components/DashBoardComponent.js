/*
Components for rendering a dashboard.
This has two types, one for read only and the other is editable
DashBoardViewComponent DashBoardEditComponent resp.
*/

import React from 'react';
import CellComponent from './CellComponent'
import DashBoardModalContainer from '../containers/DashBoardModalContainer'

export const DashBoardViewComponent = ({data}) => {
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

export const DashBoardEditComponent = ({data}) => {
   // Get the data.cells
    let cells = data.cells.map((cell,i)=>(<CellComponent  key={"cell-"+i} cellKey={"cell-"+i} {...cell}/>));
    return( <div>
    	     <div className="row" > 
                  <div className="col-sm-12">
                  
		              <DashBoardToolBarComponent title={data.title}/>
		              
                  </div>
                  <DashBoardModalContainer />
              </div>
             <div className="row cell-content-row">
                <div className="col-sm-12">
			    	   <div className="cell-container">
			    	      
			              {cells}
			           </div>
			    </div>
			  </div>
			 </div>
    	);

}

/*
Edit dashboard header and toolbar component
*/
const DashBoardToolBarComponent = ({title})=>(

	<div className="dashboard-edit" data-spy="affix" >
		    
       <div className="page-header zero-bottom" >
          <h1>{title}</h1>
           <div className="button-toolbar" >
            <div className="section">
              <div className="btn-group" role="group" aria-label="...">
                <button type="button" data-keyboard="false" 
                  className="btn btn-default" data-toggle="modal"
                  id="text-toolbar" data-target="#cell-modal" data-backdrop="static" >+ T</button>
                <button type="button" className="btn btn-default" data-toggle="modal" 
                data-target="#g-cell-modal" data-keyboard="false" id="graph-toolbar" data-backdrop="static" >+ G</button>
                <button type="button" className="btn btn-default" data-toggle="modal" data-target="#head-modal">Show Data</button>
            </div>
          </div>
           
         </div>
       </div>
   </div>

)

