import React from "react";
import ReactDOM from "react-dom";
import BallGraph from "./Graph/BallGraph";
import BarGraph from "./Graph/BarGraph";
import DropDown from "./Menu/DropDown";

let data1 = [{person: "Pieter",income: 5000},{person:"Jan",income:4000},{person:"Karel",income:8000}];
let data2 = [{person: "Lisa",income: 6000},{person:"Merel",income:5000},{person:"Amy",income:4000}];
let data3 = [...data1, ...data2,{person:"Daniel", income: 2000},{person: "Jerrey", income: 1000},
             {person: "Lilly", income: 500}, {person: "Isabelle", income: 3000}];
let color = ["#173f5f","#20639b","#3caea3","#f6d55c","#ed553b"];

let state,oldState = "Scatterplot";

function generateRandomData(items){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: Math.random()})
  }
  return returnData;
}
function switchValue(e){
  console.log(e);
  switch (e.value) {
    case "Scatterplot":
      state = e.value;
      break;
    case "Bar":
      state = e.value;
      break;
    default:
      state = "none";
      break;
  }
}

// function isUpdated(){
//   if(state != oldState){
//     oldState = state;
//     return false;
//   }else{
//     return true;
//   }
// }

function loadGraph(e){
  console.log("load the graph");
  switch(e){
    case "Scatterplot":
      return <BallGraph id="ball1" palette={color} data={generateRandomData(20)} width={500} height={500}
              tooltip={{height:30,width:80,margin:3,border_width:2}}/>;
    case "Ball":
      return <BarGraph id="bar1" palette={color} data={data3} width={500}
              height={500} maxValue={Math.max.apply(Math, data3.map(function(o){return o.income}))}/>;
  }
}
console.log(data3);
ReactDOM.render(

  <div>
    <BarGraph id="bar1" palette={["#af0000","#10dbcf"]} data={data3} width={500} height={500}
     maxValue={{x:500 , y: Math.max.apply(Math, data3.map(function(o){return o.income})),
                c:  Math.max.apply(Math, data3.map(function(o){return o.income}))}}
     tooltip={{}}/>
  </div>,
  document.getElementById("content")
);
