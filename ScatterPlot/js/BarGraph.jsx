import React from "react";
const d3 = require('d3');
// import {Button} from "react-bootstrap";

export default class BarGraph extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      data: this.props.data,
      height: this.props.height || 500,
      width: this.props.width || 500,
      margin: this.props.margin || 5
    };
  }
  generateDataVisual (){
    let canvas = d3.select("#" + this.state.id)
                   .append("svg")
                   .attr("width", this.state.width)
                   .attr("height", this.state.height);
    console.log(this.state);
    let barWidth = (this.state.width - (this.state.margin*this.state.data.length))/this.state.data.length;
    let barMargin = this.state.margin;

    let bars = canvas.selectAll("rect")
                      .data(this.state.data)
                      .enter()
                        .append("rect")
                        .attr("width", function(d){return d.income / 100})
                        .attr("height", function(d){return barWidth})
                        .attr("y", function(d, i){return i * (barMargin+barWidth)});
  }
  render () {
    return(
        <svg height={this.state.height} width={this.state.width}>
        </svg>
    )
  }
}
