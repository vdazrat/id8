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
import { makeC3Hist } from '../p3toc3'

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

const CellTextData = ({data})=>(
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
        
        c3.generate(
        {  bindto:bindId,
          data: c3Data,
          legend: {
           position: 'right'
          }

        }

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
      case 'bar':{

        return Object.assign({},{
          columns:makeC3Hist(JSON.parse(data.figures[0].dataframe))
            },{type:'bar'});
      }
    }
}


export default CellComponent;
