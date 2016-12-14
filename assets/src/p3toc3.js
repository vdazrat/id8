/*
Module to convert data from p3 to c3 usable format
*/

const makeHistogram = (list)=>{

let i;
let obj = {};
for(i=0;i<list.length;i++){
    if(!obj.hasOwnProperty(list[i])){
	    obj[list[i]] = 1;
	}
	else{
	    obj[list[i]] += 1;
	}
}

return obj;
}

export const makeC3Hist = (series)=>{

let key = Object.keys(series)[0];
let hist = makeHistogram(objToArr(series[key]));
let columns = [];
for (let k in hist){
    if(hist.hasOwnProperty(k)){
	   let column = [k,hist[k]];
	   columns.push(column);
	}
}
return columns;
}

export const objToArr = (arrayLike) =>{
    let keys = Object.keys(arrayLike);
    return keys.map((i)=>(arrayLike[i]));

}

export const transformPanda = (pandaObj) =>{
     let shadow = Object.assign({},pandaObj);
     for(let i in shadow){
     	shadow[i] = objToArr(shadow[i])
     }
     return shadow;
}
