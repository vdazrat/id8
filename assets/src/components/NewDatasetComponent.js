/*
Component to add a new dataset
*/
import React, { PropTypes } from 'react'


const NewDatasetComponent  = ({isFetching,submitted,success,onFormSubmit,onSuccess,onFailure})=>{
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

        <div className="dataset-form" >
               <div className="col-sm-8">
               <div className="page-header">
                  <h1>Add a new Dataset</h1>
               </div>
               <div className="section">
                 <form  id="dataset-form" onSubmit={function(e){
                 	              e.preventDefault();
                 	              // validate the form data
                 	              let fd = new FormData($("#dataset-form")[0]);
                 	              if(!validate(fd)){return false;}
                 	              onFormSubmit({formData:fd},"/api/dataset/",onSuccess,onFailure);
                 	               }} >
                   <div className="form-group">
                     <label htmlFor="dataset-name">Dataset Name</label>
                     <input type="text" name="dataset-name" className="form-control" placeholder="Enter a name for the dataset"/>
                   </div>

                   <div className="form-group">
                        <label>Set the data via</label>
                     <div className="radio">
                        <label><input type="radio" name="dataset-type" defaultChecked value="csv"/>CSV</label>
                    </div>
                    <div className="radio">
                      <label><input type="radio" name="dataset-type" value="api"/>API</label>
                    </div>

                   </div>

                   <div className="form-group">
                       <label htmlFor="csv-file">Upload CSV</label>
                       <input type="file" name="csv-file" />
                       <p className="help-block">Upload a CSV file.</p>
                   </div>
                    <div className="form-group">
                       <label htmlFor="description">Description</label>
                       <textarea  name="description" className="form-control" placeholder="Include a brief description of what the data is.."/>
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

		
	)
}

function validate(formData){

if(formData.get('dataset-name') === ''){
	alert('Please enter a name for the dataset!');
	return false;
}
if((formData.get('dataset-type') === 'csv')&&
	(formData.get('csv-file').size === 0)
	){
	alert('Please select a CSV file!');
    return false;
}
return true;

}

export default NewDatasetComponent;