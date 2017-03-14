/*
CellComponent
is a component that renders a cell from the state branch state.mainFrame.data.cells
cells is defined as a list of shape:
 cells:[
         {             ///  -->this is a Cell
           isFetching:false,
           isInvalidated:false,
           api:'http://..'
           payload:{
              cell_type:'TextData',
              ...
           }
         },..
       ]
*/
import React, { PropTypes } from 'react'
import { makeC3Hist,makeC3Bar } from '../p3toc3'

const CellComponent = ({isFetching,isInvalidated,api,payload,cellKey}) =>{

	if(isFetching){
        return (<CellLoading />);
	}
	else{
        switch(payload.cell_type){
        	case "TextData":{
        		return (
                       <CellTextData  data={payload}/>
        			);
        	}
        	case "Chart":{
        		return (
                      <CellChart  cellKey={cellKey} data={payload} />
        			);
        	}
        	default: return (<div/>);
        }
     
	}

}

const CellLoading = ()=>(
     <div className="alert alert-info">loading cell...</div>
	)

/*
Editable Cell- CellTextDataEditable
*/

const CellTextData = ({data})=>(
      <div className="cell-container">
        <div className="well">
          <div className="header">
            <div className="dropdown edit-cell">
                        <button className="close btn btn-default dropdown-toggle" 
                           type="button" id="dropdownMenu1" data-toggle="dropdown" 
                                   aria-haspopup="true" aria-expanded="true">
                          <span >&hellip;</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right"  aria-labelledby="dropdownMenu1">
                          <li><a href="#"  data-toggle="modal" data-target="#cell-modal">Edit</a></li>
                          <li role="separator" className="divider"></li>
                          <li><a href="#">Delete</a></li>
                        </ul>
              </div>
          </div>
           <div className="section">
              <p>{data.description}</p>
           </div>
         </div>
      </div>
	)


const CellTextDataViewOnly = ({data})=>(
        <div className="well">
      <p>{data.description}</p>
      </div>
  )


class CellChart extends React.Component{
    /*
    This is the where the chart data in a cell is displayed.
    This is not a pure function as it needs to call a c3 method as well.
    Props recieved by this component is data
    data = {
	   cell_type:'Chart',
      "id": 1,
      "title": "Simple Chart",
      "xlabel": "x axis",
      "ylabel": "yaxis",
      chart_type:"pie",
      "figures": [
          {
              "id": 1,
              "dataframe": "{\"bug\":{\"0\":joe,\"1\":joe,\"2\":moe,\"3\":moe,\"4\":curly,\"5\":joe,\"6\":john,\"7\":bon,\"8\":bon,\"9\":hon}}"
            
          }
      ]

    }
    */
    componentDidMount(){
    	let data = this.props.data;

    	let c3Data = getC3Data(data);
        window.c3Data = c3Data;
        let bindId = "#chart-"+this.props.cellKey;

        let c3params = Object.assign({},{bindto:bindId,
                        legend: {
                           position: 'right'
                        },
                        data:c3Data
                      },c3Data.options);

        
        c3.generate(
        c3params

        ); 
        /*

        c3.generate({
    data: {
        // iris data from R
        bindto:"#chart-cell-1",
        columns: [
            ['data1', 30],
            ['data2', 120],
        ],
        type : 'pie'}});
        */

    
    }
    render(){
        return (
            <div className="graph-panel">
              <h4 style={{textAlign:'center',paddingTop:"15px"}}>{this.props.data.title}</h4>
        	    <div id={"chart-"+this.props.cellKey} >
        	    </div>
        	 </div>);
    }

}


const getC3Data = (data) => {
    let c3data = {};
    // handling just one figure for now
    switch(data.chart_type){

    	case 'pie':{

    		return Object.assign({},{
    			columns:makeC3Hist(JSON.parse(data.figures[0].dataframe))
    		    },{type:'pie'});
    	}
      case 'hist':{

        return Object.assign({},{
          columns:makeC3Hist(JSON.parse(data.figures[0].dataframe))
            },{type:'bar'});
      }
      case 'stackedbar':{
        let dataSet = JSON.parse(data.figures[0].dataframe);
        let lastKey = Object.keys(dataSet).slice(-1);
        let len = Object.keys(dataSet[lastKey]).length;
        let arrLikeObj = Object.assign({},dataSet[lastKey],{length:len})
        let lastArr = Array.from(arrLikeObj);
        
        return Object.assign({},{
          columns:makeC3Bar(dataSet)
            },
            {
             type:'bar',
             groups: [
                        Object.keys(dataSet).slice(0,-1)
                        //['data1', 'data2','data3']
                    ],
             order:'asc',
             options:{
                 bar: {
                    width: {
                      ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                 },

                 axis:{
                    x: {
                     type: 'category',
                     categories: lastArr
                        }
                    
                }
            }
           });
      }
      case 'bar':{
        let dataSet = JSON.parse(data.figures[0].dataframe);
        let lastKey = Object.keys(dataSet).slice(-1);
        let len = Object.keys(dataSet[lastKey]).length;
        let arrLikeObj = Object.assign({},dataSet[lastKey],{length:len})
        let lastArr = Array.from(arrLikeObj);
        
        return Object.assign({},{
          columns:makeC3Bar(dataSet)
            },
            {
             type:'bar',
             options:{
                 bar: {
                    width: {
                      ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                 },
                 axis:{
                    x: {
                     type: 'category',
                     categories: lastArr
                        }
                    
                }
            }
           });
      }
    }
}


export default CellComponent;
