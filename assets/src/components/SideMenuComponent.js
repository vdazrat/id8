/*
Component for sidemenu 
Components need to be pure functions, implement the same as one
*/
import React, { PropTypes } from 'react'

const SideMenuComponent = ({sideMenuItems,selected,onClick,onAdd}) => {
/*
This is the main side menu component, which consists of the entire side nav menu:
Props that are passed to this component are:
sideMenuItems - is an array of items, this is the sideMenuItems from the state object state.sideMenu
selected - is the part of the state, state.sideMenu.selected
onClick - is a method which is dispatched in the onclick events. Defined in the container.
*/
let itemCounter = 0;
let sideItems = sideMenuItems.map((sideItem)=>(<SideMenuItemName key={itemCounter} selected={selected} onClick={onClick} onAdd={onAdd} {...sideItem} keyVal={itemCounter++}/>));
  

  return(
        <nav className="h-nav">
          <div className="header">
            
          </div>

          <div className="section">
          <ul className="items">
           
          {sideItems}
          

          </ul>
          </div>

        </nav>
        );

}	


const SideMenuItemName = ({name,subItems,icon,keyVal,selected,onClick,addNew,onAdd}) => {
  /*
   Component for a single menu of the side menu.
   This component can either be a single menu or a colapsable with submenues(SideMenuSubItems)
   The props for this component are just forwarded from the SideMenuComponent
  */
  let active = '';
  if(selected.name === name){
    active = "active";
  }
  return ( 
        
        
          (subItems.length > 0 || addNew !== undefined)?(
          <article key={keyVal}>
          <li className={"main-item "+ active } data-toggle="collapse" data-target={"#item"+keyVal}>
            <a className="item-text"><i className={"fa fa-"+icon+" fa-lg"}></i> {name}</a> <span className="arrow"></span>
            
          </li>

         <SideMenuSubItems name={name} subItems={subItems} subItem={selected.name===name?selected.subItem:-1} keyVal={keyVal} onClick={onClick} addNew={addNew} onAdd={onAdd}/>
          </article>)
         :
         (<article>
         <li className={"main-item "+ active} onClick={()=>{onClick({name:name})}}>
               <a className="item-text"><i className={"fa fa-"+icon+" fa-lg"}></i> {name}</a>
         </li>
        </article>)

        
         
   
            );
}

const SideMenuSubItems = ({name,subItems,keyVal,subItem,onClick,addNew,onAdd}) => {
  /*
  Component for the subitems for a menu item.
  Props are:
  name, subItems,onClick - forwarded from SideMenuItems
  keyVal - a unique id for the SideMenuItem
  subItem - a number which corresponds to state.selected.subItem or -1
    The item is set to active, based on subItem value. A value other than -1 indicates that
    a subitem is selected.
  */
    let items = subItems.map((v,i)=>{
        let active = '';
        if(subItem === i){
          active ="active";
        }
        return(
         <li className={"sub-item "+active} key={keyVal + '-'+i} onClick={()=>{
          onClick({name:name,
                   subItem:i,
                    api:v.api})}}>
                    <a className="item-text">{v.title}</a>
          </li>
      )});
    if(addNew !== undefined){
      // add the add new button
      items.push( 
           (function(){
              let active = '';
              if(subItem === "new"){
                  active ="active";
               }
               return(
              <li className={"sub-item new "+active} key={keyVal + '-'+items.length}  onClick={()=>{
                  onAdd({name:name,
                        subItem:"new"
                  })}}>
                    <a className="item-text">{addNew.title}</a>
              </li>);
        })());
    }
    if(items.length > 0){
      return(
        <ul id={"item"+keyVal} className={"sub-items collapse "+((subItem==="new" || subItem>-1)?"in":"")} >
            {items}
         </ul>
        );
    }
    return (null);

}



export default SideMenuComponent;


