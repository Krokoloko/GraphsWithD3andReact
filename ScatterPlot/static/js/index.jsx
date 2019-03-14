import React from "react";
import ReactDOM from "react-dom";
import BallGraph from "./Graph/BallGraph";
import BarGraph from "./Graph/BarGraph";
import DropDown from "./Menu/DropDown";
let $ = require('jquery');


let data;
let toggle = false;
let color = ["#173f5f","#20639b","#3caea3","#f6d55c","#ed553b"];

function generateRandomData(items){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: Math.random()})
  }
  return returnData;
}

function getJsonAsObject(path,callback){

  let json_object
  $.get(path,(data)=>{
    json_object = JSON.parse(data);
  })
  .fail(function(){
    console.log("Can\'t retrieve json string, be sure to check if the url is correct.");
  })
  .done(function(){
    callback(json_object);
  });
}

getJsonAsObject(window.location.href + "worker_data",
function(obj){
  data = obj;

  ReactDOM.render(
    <div>
    <BallGraph id="ball1" palette={color} data={generateRandomData(5)} width={500} height={500}
    tooltip={{height:30,width:80,margin:-10,border_width:2}}/>
    </div>,
    document.getElementById("content")
  );
});
