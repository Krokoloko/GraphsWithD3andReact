import React from "react";
import * as d3 from "d3";

export default class LineGraph extends React.Component{
  constructor(props){
    super(props);
    let time = new Date();
    this.state = {
      id: this.props.id || "LineGraph" + time.getTime(),
      width: this.props.width || 500,
      height: this.props.height || 500,
      maxValue: this.props.maxValue || {x:this.props.width,y:this.props.height},
      data: this.props.data || [{},{}],
      point: this.props.point || {radius: 7, color: "rgba(40,100,30,1)", border: 3, border_color: "rgba(255,240,240,1)"},
      line: this.props.line || {width: 3, color: "rgba(40,180,30,1)"},
      animationDurations: this.props.animationDurations || {start:1500,update:2000},
      lineCount: 1
    }
    console.log(this.state.data);
  }
  componentDidMount(){
    let logWhileSet = function(set,log){
      console.log(log);
      return set;
    };

    let xScale = d3.scaleLinear().domain([0,this.state.maxValue.x]).range([0,this.state.width]);
    let yScale = d3.scaleLinear().domain([0,this.state.maxValue.y]).range([0,this.state.height]);

    let lineGroup = d3.select("#" + this.state.id + "_lines");
    let pointGroup = d3.select("#" + this.state.id + "_points")
                       .selectAll("circle")
                       .data(this.state.data);

    let assignPoints = pointGroup.enter().append("circle")
                                  .style("stroke", this.state.point.border_color)
                                  .style("stroke-width", this.state.point.border)
                                  .attr("r", 0)
                                  .attr("cx", (d) => d.x)
                                  .attr("cy", (d) => this.state.height-yScale(d.y))
                                  .merge(pointGroup)
                                  .transition()
                                  .duration(this.state.animationDurations.start)
                                  .style("stroke", this.state.point.border_color)
                                  .style("stroke-width", this.state.point.border)
                                  .attr("r", this.state.point.radius)
                                  .attr("cx", (d) => d.x)
                                  .attr("cy", (d) => this.state.height-yScale(d.y));

    console.log(this.state.data);
    for (let i = 0; i < this.state.data.length; i++) {
      console.log(i);
      if (i != 0) {
        console.log(this.state.data[i]);
        lineGroup.append("line")
                  .attr("x1",this.state.data[i-1].x)
                  .attr("y1",this.state.height-yScale(this.state.data[i-1].y))
                  .attr("x2",this.state.data[i-1].x)
                  .attr("y2",this.state.height-yScale(this.state.data[i-1].y))
                  .style("stroke", this.state.line.color)
                  .style("stroke-width", this.state.line.width)
                  .merge(lineGroup)
                  .transition()
                  .duration(this.state.animationDurations.start)
                  .attr("x2",this.state.data[i].x)
                  .attr("y2",this.state.height-yScale(this.state.data[i].y))
      }
    }

  }
  render(){
    return <svg id={this.state.id} width={this.state.width} height={this.state.height}>
      <g id={this.state.id+"_lines"} transform="translate(0,0)"></g>
      <g id={this.state.id+"_points"} transform="translate(0,0)"></g>
    </svg>
  }
}
