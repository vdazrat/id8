/*
Component to add a new dashboard
*/
import React, { PropTypes } from 'react'


const NewDashBoardComponent  = ({isFetching,submitted,success,datasets,onFormSubmit,onSuccess,onFailure})=>{

  return (submitted === true)?
    (
      <div className="dataset-form" >
               <div className="col-sm-8">
               <div className="page-header">
               {(success)?("Request has been submittted")
                            :
                            ("Request has failed")
                 
               }
               </div>
         </div>
     </div>
    )
   :

	 (

     <div className="dashboard-form" >
           <div className="col-sm-8">
           <div className="page-header">
              <h1>Add a new Dashboard</h1>
           </div>
           <div className="section">
             <form id="dashboard-form" action="/api/dashboard/" onSubmit={function(e){
                            e.preventDefault();
                            // validate the form data
                            let fd = new FormData($("#dashboard-form")[0]);
                            if(!validate(fd)){return false;}
                            onFormSubmit({formData:fd},$("#dashboard-form").attr('action'),onSuccess,onFailure);
                             }} >
               <div className="form-group">
                 <label htmlFor="title">Dashboard Name</label>
                 <input type="text" name="title" className="form-control" placeholder="Enter a name for the dashboard"/>
               </div>

               <div className="form-group">
                    <label>Select a Dataset</label>

                    {formDatasetSelect(datasets)}
                

               </div>
               <div className="form-group">
                {
                 (isFetching === false)? (
                <button type="submit" className="btn btn-primary" >Submit</button>
                ):
                 (
                  <button  className="btn btn-primary disabled" disabled>Submiting, please wait</button>
                 )
                }
                </div>
             </form>

           </div>
           </div>
         </div>
		);
}

const formDatasetSelect = (datasets)=> {
/*dataset has the shape 
  dataset = [{title:"",api:""},{title:"",api:""}...]
*/
 let datasetList = datasets.map((v,i)=>(
              <option key={"dset-"+i} value={v.api}>{v.title}</option>
  ));
 return(
       <select className="form-control" name="dataset">
       {datasetList}
       </select>
  );

}

function validate(formData){

if(formData.get('title') === ''){
  alert('Please enter a name for the dashboard!');
  return false;
}
return true;

}

export default NewDashBoardComponent;