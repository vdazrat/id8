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

window.makeC3Hist = makeC3Hist;
export const objToArr = (arrayLike) =>{
    let keys = Object.keys(arrayLike);
    return keys.map((i)=>(arrayLike[i]));

}

/*
Make a C3 Bar given a panda dataframe of the type
{
data1:{0:val1,1:val2}
data2:{0:val3,1:val4}
}
to [
['data1',val1,val2],
['data2',val3,val4]
]
*/
export const makeC3Bar = function(series){
    let keys = Object.keys(series);
    let axisColumn = keys.slice(-1);
    let dataCols = keys.slice(0,-1);
    let columns = dataCols.map(function(val){
        let len = Object.keys(series[val]).length;
        let arrLikeObj = Object.assign({},series[val],{length:len})
        let arr = Array.from(arrLikeObj);
        arr.unshift(val);
        return arr;
    });
    return columns;

}

export const transformPanda = (pandaObj) =>{
     let shadow = Object.assign({},pandaObj);
     for(let i in shadow){
     	shadow[i] = objToArr(shadow[i])
     }
     return shadow;
}
