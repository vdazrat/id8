/*
Modals for edit dashboards
*/
import React from 'react';
import {transformPanda} from '../p3toc3'

class DashBoardModalComponent extends React.Component{

  componentDidMount(){
  /* Initialize the onLoad method here, which takes care of the modal events*/
         this.props.onLoad();
  }

  render(){

     return(
        <div className="container-dashboard-modals">
            <TextDataModal {...this.props}/>
            <GraphModal {...this.props}/>
            <ShowDataModal head={this.props.head} dashboard={this.props.dashboard} fetchHead={this.props.fetchHead}/>
          </div>
      );

  }
}


/*
TextData modal
*/
const TextDataModal = ({dashboard,onFormSubmit,onSuccess,onFailure}) =>(

	<div className="modal fade" id="cell-modal" tabIndex="-1" role="dialog" 
                               aria-labelledby="myModalLabel" aria-hidden="true">
	      <div className="modal-dialog" role="document">
	        <div className="modal-content">
             <form id="new-text-cell" action='/api/cell/' 
                 onSubmit={(function(){
                           let fdFields = {'type':'TextData',
                                           'dashboard':dashboard};
                           
                           return getOnSubmitFunction("#new-text-cell",
                                                      "#cell-modal",
                                                      "#save-text-cell",
                                                      fdFields,
                                                      onFormSubmit,
                                                      onSuccess,
                                                      onFailure);
                           })()
                          }>
	          <div className="modal-header">
	            <button type="button" className="close cancel-text" data-dismiss="modal" aria-label="Close">
	              <span aria-hidden="true">&times;</span>
	            </button>
	            <h4 className="modal-title" id="myModalLabel">Add new TextData cell 
             
              <span className="submit-error" style={{color:'red',display:'none'}}>&nbsp;Failed.</span>
              </h4>
	          </div>
	          <div className="modal-body">
	              <textarea className="form-control" rows="5" id="description" name="description"></textarea>

	          </div>
	          <div className="modal-footer">
	            <button type="button" className="btn btn-secondary cancel" data-dismiss="modal">Close</button>
	            <button id="save-text-cell" type="submit" className="btn btn-primary">Save</button>
	          </div>
             </form>
	        </div>
	      </div>
    </div> 
)

/*
Graph modal
*/

const GraphModal = ({dashboard,onFormSubmit,onSuccess,onFailure}) => (
    <div className="modal fade" id="g-cell-modal" tabIndex="-1" role="dialog" 
                               aria-labelledby="myModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            {/* Begin Form*/}
                           <form  id="new-chart-cell" action='/api/cell/' 
                                   onSubmit={(function(){
                                             let fdFields = {'type':'Chart',
                                                             'dashboard':dashboard};
                                             
                                             return getOnSubmitFunction("#new-chart-cell",
                                                                        "#g-cell-modal",
                                                                        "#save-chart-cell",
                                                                        fdFields,
                                                                        onFormSubmit,
                                                                        onSuccess,
                                                                        onFailure);
                                             })()
                          }>
                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel">Add new Graph cell</h4>
                          </div>
                          <div className="section">
                             <div className="col-sm-6">
                              <div className="row">
                                 <div className="col-sm-12">
                                   <label htmlFor="graph-type">Graph Type</label>
                                    <select  className="form-control" name="chart_type">
                                     <option value="pie">Pie</option>
                                     <option value="donut">Donut</option>
                                     <option value="bar">Bar</option>
                                     <option value="scatter">Scatter</option>
                                     <option value="line">Line</option>

                                    </select>
                                    <label htmlFor="title">Title</label>
                                    <input className="form-control" type="text" name="title"/>
                                    <label htmlFor="formula">Formula</label>
                                    <input className="form-control" type="text" name="formula"/>
                                    <label htmlFor="x-label">Xaxis</label>
                                    <input className="form-control" type="text" name="xlabel"/>
                                    <label htmlFor="y-axis">Yaxis</label>
                                    <input className="form-control"  type="text" id="ylabel"/>

                                    <button type="button" className=" form-control btn btn-success">Preview</button>
                                 </div>
                              </div>
                               
                             </div>
                             <div className="col-sm-6">
                               <div className="row">
                                  <div className="col-sm-12">
                                    <label>Graph Preview</label>
                                    <div className="well" style={{minHeight:"200px"}}></div>
                                 </div>
                               </div>
                             </div>

                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary cancel" data-dismiss="modal">Close</button>
                            <button type="submit" id="save-chart-cell"
                                     className="btn btn-primary">Save changes</button>
                          </div>
                          </form>
                            {/* End form*/}
                        </div>
                      </div>
                    </div>
)

/*
show data modal
*/

class ShowDataModal extends React.Component{

  componentDidMount(){
  /*Fetch the data head from here*/
    this.props.fetchHead(this.props.dashboard+'head/');
    

  }

  render(){

  
    return(
   <div className="modal fade" id="head-modal" tabIndex="-1" role="dialog" >
          <div className="modal-dialog" role="document">
           <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">Dataset Header</h4>
              </div>
              <div className="modal-body">
                   <DatasetHead dataset={this.props.head} />
              </div>
             
            </div>
           
          </div>
    </div>
  );
  
  }
}

/*
Component returns a dataset table given a dataset
*/
const DatasetHead = ({dataset})=>{
    // return empty div if dataset is undefined
    if(dataset === undefined){
      return (<div />);
    }
    // convert dataset to usable form
    let shadow = transformPanda(dataset);
    // form the table header
    let head = <tr>
                <th>#</th>
                {Object.keys(shadow).map((v,i)=>(<th key={"head-"+i}>{v}</th>))}
              </tr>;
    // Next form the body of the table row by row         
    let tbody = [];
    let dataKeys = Object.keys(shadow);  // all the keys of the dataset
    for(let i=0; i< shadow[dataKeys[0]].length  ;i++){ // for the length of each series
      let rows=[];
      rows.push(<th scope="row" key={"scope-"+i}>{i+1}</th>);
      for(let j=0;j < dataKeys.length;j++){           // form the table row wise from series format
        rows.push(<td key={"col-"+i+"-"+j}>{shadow[dataKeys[j]][i]}</td>);
      }
      tbody.push(<tr key={"row-"+i}>{rows}</tr>);
    }
return(
    <table className="table table-hover">
        <thead>
         {head}
        </thead>
        <tbody>
          {tbody}
         
        </tbody>
      </table>
    );
}

function getOnSubmitFunction(form,modal,saveCellButton,fdFields,onFormSubmit,onSuccess,onFailure){
/*
Function returns a fuction to be used for the onSubmit handler
*/
    return (
        function(e){
             e.preventDefault();
             // do a direct DOM manipulation here,
             // I know it's a hack, but the other option is too lengthy
             // to achieve a very small effect
             let fd = new FormData($(form)[0]);
             for(let field in fdFields){
                  fd.append(field,fdFields[field]);
             }
             $(saveCellButton).text("Submitting");
             $(saveCellButton).addClass('disabled').attr('disabled',true);
              $(".cancel").addClass('disabled').attr('disabled',true);

            
             onFormSubmit({formData:fd},
                         $(form).attr('action'),
                          (data)=>{
                             $(saveCellButton).text("Save");
                              $(saveCellButton).removeClass('disabled')
                                                  .attr('disabled',false);
                             $(".cancel").removeClass('disabled')
                                                  .attr('disabled',false);
                            $(modal).modal('toggle');
                            onSuccess(data);
                          }

                          // request has failed
                          ,function(data){
                              $(saveCellButton).text("Save");
                              $(saveCellButton).removeClass('disabled')
                                                  .attr('disabled',false);
                             $(".cancel").removeClass('disabled')
                                                  .attr('disabled',false);
                            $(".submit-error").show();
                            onFailure(data);

                          });
        }
      );
}
export default DashBoardModalComponent;