import React from "react";
import ReactDOM from "react-dom";
import BallGraph from "./Graph/BallGraph";

let data1 = [{person: "Pieter",income: 5000},{person:"Jan",income:4000},{person:"Karel",income:8000}];
let data2 = [{person: "Lisa",income: 6000},{person:"Merel",income:5000},{person:"Amy",income:4000}];
let color = ["#173f5f","#20639b","#3caea3","#f6d55c","#ed553b"];

function generateRandomData(items){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: Math.random()})
  }
  return returnData;
}
function switchValue(e){
  switch (e.value) {
    case "Scatterplot":
      return e.value;
    case "Bar":
      return e.value;
    default:
      return "none";

  }
}



ReactDOM.render(

  <div>

    <select>
      <option onClick={(e) => switchValue(e)} value="Scatterplot">Scatterplot</option>
      <option onClick={(e) => switchValue(e)} value="Bar">Bar</option>
    </select>
    <BallGraph id="data1" palette={color} data={generateRandomData(20)} width={500} height={500}/>
  </div>,
  document.getElementById("content")
);
