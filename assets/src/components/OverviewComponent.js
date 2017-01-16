/*
Overview component
*/

import React, { PropTypes } from 'react'

class OverviewComponent extends React.Component{



render(){
    return(
	    <div className='Overview-panel'>       
	    <div className="row" > 
                <div className="page-header">
                <h1>Overview</h1>
                </div>

                 <div className="col-sm-8">
                  {/* add a new component here */}
                   <WatchChartComponent />
             
                  {/* end new component */}
                  </div>

                  <div className="col-sm-4">
                  {/* add a new component here */}
                    <div className="sidelist"> 
                    <div className="panel panel-default recent-panel">
                        <div className="panel-heading">Recent Activity</div>
                        <div className="panel-body">

                       
                         <ul className="recent-item-list">
                           <li className="recent-item">
                           
                           <a href="#">Resync of dataset CPM was successful</a></li>
                           <li className="recent-item">
                          
                           <a href="#">Resync of dataset TESTDATA failed</a></li>
                            <li className="recent-item">
                            
                            <a href="#">Dashboard CPM created by user VDASARAT</a></li>

                         </ul>
                        </div>
                    </div>

                    <div className="panel panel-default faq-panel">
                        <div className="panel-heading">FAQs</div>
                        <div className="panel-body">
                          <ul className="recent-item-list">
                           <li className="recent-item">
                           
                           <a href="#">How do I upload a dataset?</a></li>
                           <li className="recent-item">
                          
                           <a href="#">What kind of analysis can I perfom on my data?</a></li>
                            <li className="recent-item">
                            
                            <a href="#">What are API syncs?</a></li>
                             <li className="recent-item">
                            
                            <a href="#">How can I track a certain dashboard?</a></li>
                             <li className="recent-item">
                            
                            <a href="#">Who can create dashboards?</a></li>

                         </ul>
                        </div>
                    </div>
                  </div>
                  {/* end new component */}
                  </div>
                 
             </div>         
	    </div>
	    );
}
}

/*
Temporary class, refactor this later
*/
class WatchChartComponent extends React.Component{

	componentDidMount(){
    	
		var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['data1', -30, 200, 200, 400, -150, 250],
            ['data2', 130, 100, -100, 200, -150, 50],
            ['data3', -230, 200, 200, -300, 250, 250]
        ],
        type: 'bar',
        groups: [
            ['data1', 'data2']
        ]
    },
    grid: {
        y: {
            lines: [{value:0}]
        }
    }
});

  var chart2 = c3.generate({
    bindto: '#chart2',
    data: {
        columns: [
            ['data1', 300, 350, 300, 0, 0, 100],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            data1: 'step',
            data2: 'area-step'
        }
    }
});

  var chart3=c3.generate({
     bindto: '#chart3',
    data: {
        // iris data from R
        columns: [
            ['data1', 30],
            ['data2', 120],
        ],
        type : 'pie'
       
    }
});
    
    }

     render(){
        return (
        	 <div className="panel panel-default watch-panel">
                        <div className="panel-heading">Watching</div>
                        <div className="panel-body">
                            <a>P1 chart</a>
                            <div id="chart"></div>
                            <a>Cumulative Total effort reduction</a>
                             <div id="chart2"></div>
                             <a>Workload distribution</a>
                             <div id="chart3"></div>
                        </div>
                    </div>
           );
    }
}

export default OverviewComponent;