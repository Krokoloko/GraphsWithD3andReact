import React from "react";
import ReactDOM from "react-dom";
import BallGraph from "./BallGraph";

let data1 = [{person: "Pieter",income: 5000},{person:"Jan",income:4000},{person:"Karel",income:8000}];
let data2 = [{person: "Lisa",income: 6000},{person:"Merel",income:5000},{person:"Amy",income:4000}];
ReactDOM.render(
  <div>
    <BallGraph id="data1" width={500} height={500}/>
  </div>,
  document.getElementById("content")
);
