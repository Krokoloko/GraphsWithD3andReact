
import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import BallGraph from "./Graph/BallGraph";
import BarGraph from "./Graph/BarGraph";
import SelectionSystem from './Graph/SelectionSystem';
import DropDown from "./Menu/DropDown";
let $ = require('jquery');


let data;
let toggle = false;
let color = ["#173f5f","#20639b","#3caea3","#f6d55c","#ed553b"];

function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length)
      return false;
  for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
          return false;
  }
  return true;
}

function emptyArray(array){
  array.forEach(
    function() {
      emptyArr.push({data:[]});
    }
  );
}

function generateRandomData(items,radius){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: radius||Math.random()})
  }
  return returnData;
}

lowerAplha(c,b){
  let loweredColor = c;
  if(b){
    let split = c.split("(");
    loweredColor = split[0].concat("a","(").concat(loweredColor.slice(c.indexOf("(")+1,c.length-1).concat(",0.4",")"));
    return loweredColor;
  }else{
    let split = c.split("(");
    loweredColor = split[0].concat("a","(").concat(loweredColor.slice(c.indexOf("(")+1,c.length-1).concat(",0",")"));
    return loweredColor;
  }
}

//The logics when to toggle a selection.
function handleOnToggle(par){
  let emptyArr = [];
  let empty = true;
  let state = par.element.getAttribute("selected");


  if(state == "true"){
    par.element.setAttribute("selected", false);
  }
  //Checks if nothing is selected
  par.selectedElements.forEach(function(e){
    if(!arraysEqual(e.data,emptyArr) && empty){
      empty = false;
      break;
    }
  });
  // If nothing is selected then it will automaticly toggle the requested element as selected.
  if(empty){
    par.element.setAttribute("selected", true);
  }else{
    let selectedGraphIndex;
    par.elements.forEach(
    function(e,i){
      let found = e.data.find(par.element);
      if(found){
        selectedGraphIndex = i;
      }
    });
    //This variable checks if there are any other graphs that hold selected elements.
    let otherGraphsAreSelected = false;
    par.selectedElements.forEach(
      function(e,i){
        if(i == selectedGraphIndex){
          return
        }
        if(!arraysEqual(i.data, emptyArray(i.data))){
          otherGraphsAreSelected = true;
          break;
        }
      });
      if(countSelected[selectedGraphIndex].data <= 3 && !otherGraphsAreSelected){
        par.element.setAttribute("selected", true);
      }
  }
}

let accesEntries = [
  function(){
    let locald3 = d3;
    let bars = locald3.select("#bar1")
                 .selectAll('.bar1_rect').nodes();
    return bars;
  }
  ,function(){
    let locald3 = d3;
    let circles = locald3.select("#ball1")
                         .selectAll("circle").nodes();
    return circles;
  }
];

let onSelect = [
  function(par){
    let locald3 = d3;
    par.elements[0].forEach(function(e,i){
      if(par.selectedElements[0].find(e)){
        return
      }
      locald3.select(e)
                .style("fill", d3.select(this))
                .merge(d3.select("#bar1")
                         .select(".bar1_group")
                         .select(".bar1_rectangles")
                         .selectAll("rect"))
                .transition()
                .duration(1000)
                .style("fill", (d,i) => lowerAplha(e.style.fill,(e.getAttribute("selected").toLowerCase()==="true")));

    });
  },
  function(par){
    console.log(par);
    console.log("selected");
  }
]
let onUnSelect = [
  function(par){
    par.element.setAttribute("selected", false);
    console.log("unselect");
  }
  ,
  function(par){
    par.element.setAttribute("selected", false);
    console.log("unselect");
  }
]

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
  console.log(data);
  ReactDOM.render(
    <div>
    <BarGraph id="bar1" class="barGraph" palette={["#5a0000","#a0ebce"]} data={data.workers} width={500} height={500} transitionTime={2000}
     maxValue={{x:500 , y: Math.max.apply(Math, data.workers.map(function(o){return o.income}))*1.2,
                c:  Math.max.apply(Math, data.workers.map(function(o){return o.income}))*1.2}}
     tooltip={{}}
     axis={{margin:{x:50,y:50}}}/>
    <BallGraph id="ball1" palette={color} data={generateRandomData(data.workers.length).map((e,i) => e = {name: data.workers[i].person,relations: data.workers[i].contacts, ...e},10)} width={500} height={500}
    tooltip={{height:30,width:80,margin:-10,border_width:2}}/>
    <SelectionSystem accesEntriesDelegate={accesEntries} selectEntriesDelegate={onSelect} unselectEntriesDelegate={onUnSelect}/>
    </div>,
    document.getElementById("content")
  );
});
// console.log(accesEntries[0]());
