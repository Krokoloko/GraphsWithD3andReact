
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

function emptyArray(length,val){
  let emptyArr = []
  let emptyVal = val || null;
  for(let i = 0;i < length; i++) {
    emptyArr.push(emptyVal);
  }
  return emptyArr;
}

function generateRandomData(items,radius){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: radius||Math.random()})
  }
  return returnData;
}

function lowerAplha(c,bool){
  let loweredColor = c;

  let r = loweredColor.split(",")[0].slice(c.indexOf("(")+1);
  let g = loweredColor.split(",")[1];
  let b = loweredColor.split(",")[2].replace(")","");

  let a = bool ? "1" : "0.3";
  loweredColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
  return loweredColor;
}

//The logics when to toggle a selection.
function handleOnToggle(par){
  let empty = true;
  let state = par.element.getAttribute("selected");

  if(state == "true"){
    par.element.setAttribute("selected", false);
    return;
  }
  //Checks if nothing is selected
  par.selected.forEach(function(e){
    if(!arraysEqual(e.data,emptyArray(e.data.length)) && empty){
      empty = false;
      return;
    }
  });
  // If nothing is selected then it will automaticly toggle the requested element as selected.
  if(empty){
    par.element.setAttribute("selected", true);
  }else{
    let selectedGraphIndex;
    par.elements.forEach(
    function(e,i){
      let found = e.data.find(function(element){
        return element == par.element
      });
      if(found){
        selectedGraphIndex = i;
      }
    });
    //This variable checks if there are any other graphs that hold selected elements.
    let otherGraphsAreSelected = false;
    par.selected.forEach(

      function(e,i){
        if(i == selectedGraphIndex){
          return
        }
        if(!arraysEqual(e.data, emptyArray(e.data.length))){
          otherGraphsAreSelected = true;
        }
    });
    if(par.selected[selectedGraphIndex].data.length <= 3 && !otherGraphsAreSelected){
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
    let nothingSelected = false;
    if(arraysEqual(par.selected[0].data,emptyArray(par.selected[0].data.length))){
      nothingSelected = true;
    }
    par.elements[0].data.forEach(function(e,i){
      locald3.select(e)
                .style("fill", locald3.select(this))
                .merge(locald3.select("#bar1")
                         .select(".bar1_group")
                         .select(".bar1_rectangles")
                         .selectAll("rect"))
                .transition()
                .duration(1000)
                .style("fill", (d,i) => lowerAplha(e.style.fill,((e.getAttribute("selected").toLowerCase()==="true")|| nothingSelected)));
    });
    par.elements[1].data.forEach(function(e,i){
      // if (par.selected[1].) {
      //
      // }
      let ifSelectedHasTheName = function(name){
        if(par.selected[0].data.find(function(d){
          return locald3.select(d).data()[0].person == name
        })){
          return true
        }else return false;
      }
      //When selected has the same name as the circle
      locald3.select(e)
              .style("stroke-width",locald3.select(this))
              .style("stroke", locald3.select(this))
              .merge(locald3.select("ball1")
                        .selectAll("circle"))
              .transition()
              .duration(1000)
              .style("stroke-width", (d) => (ifSelectedHasTheName(d.name) ? "10px" : "2px"))
              .style("stroke", (d) => (ifSelectedHasTheName(d.name) ? "#b0000b" : "#000000"))
    })
  },
  function(par){
    let locald3 = d3;
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
  ReactDOM.render(
    <div>
    <BarGraph id="bar1" class="barGraph" palette={["#5a0000","#a0ebce"]} data={data.workers} width={500} height={500} transitionTime={2000}
     maxValue={{x:500 , y: Math.max.apply(Math, data.workers.map(function(o){return o.income}))*1.2,
                c:  Math.max.apply(Math, data.workers.map(function(o){return o.income}))*1.2}}
     tooltip={{}}
     axis={{margin:{x:50,y:50}}}/>
    <BallGraph id="ball1" palette={color} data={generateRandomData(data.workers.length).map((e,i) => e = {name: data.workers[i].person,relations: data.workers[i].contacts, ...e},10)} width={500} height={500}
    tooltip={{height:30,width:80,margin:-10,border_width:2}}/>
    <SelectionSystem onToggleEntryDelegate={[handleOnToggle,handleOnToggle]} accesEntriesDelegate={accesEntries} selectEntriesDelegate={onSelect}/>
    </div>,
    document.getElementById("content")
  );
});
// console.log(accesEntries[0]());
