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
      axisMargin: this.props.axisMargin || {top:5,bottom:40,right:10,left:40},
      animationDurations: this.props.animationDurations || {start:1500,update:2000},
      timeFormat: this.props.timeFormat || "%d-%b-%Y",
      useTime: this.props.timeAsAxis || false,
      lineCount: 1
    }
    console.log(this.state.data);
  }
  componentDidMount(){
    let logWhileSet = function(set,log){
      console.log(log);
      return set;
    };
    let xScale;

    if(this.state.useTime){
      xScale = d3.scaleTime().domain(d3.extent(this.state.data, function(d){ return new Date(d.x); })).range([0,this.state.width-this.state.axisMargin.right-this.state.axisMargin.left]);
    }else{
      xScale = d3.scaleLinear().domain([0,this.state.maxValue.x]).range([0,this.state.width-this.state.axisMargin.right-this.state.axisMargin.left]);
    }

    let yScale = d3.scaleLinear().domain([0,this.state.maxValue.y]).range([this.state.height-this.state.axisMargin.bottom-this.state.axisMargin.top,0]);

    let lineGroup = d3.select("#" + this.state.id + "_lines");
    let pointGroup = d3.select("#" + this.state.id + "_points")
                       .selectAll("circle")
                       .data(this.state.data);

    let yAxis = d3.axisLeft(yScale);
    let xAxis;

    if (this.state.useTime) {
      xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat(this.state.timeFormat)).tickValues(this.state.data.map(d => new Date(d.x)));
    }else{
      xAxis = d3.axisBottom(xScale);
    }

    pointGroup.enter().append("circle")
                        .style("stroke", this.state.point.border_color)
                        .style("stroke-width", this.state.point.border)
                        .style("fill", this.state.point.color)
                        .attr("r", 0)
                        .attr("cx", (d) => xScale(this.state.useTime?new Date(d.x):d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .merge(pointGroup)
                        .transition()
                        .duration(this.state.animationDurations.start)
                        .attr("r", this.state.point.radius);

    let callYAxis = d3.select("#" + this.state.id + "_points")
                      .append("g")
                      .attr("class", "yAxis")
                      .call(yAxis);

    let callXAxis = d3.select("#" + this.state.id + "_points")
                      .append("g")
                      .attr("class", "xAxis")
                      .attr("transform", "translate("+ 0 + "," + (this.state.height - this.state.axisMargin.bottom - this.state.axisMargin.top) +")")
                      .call(xAxis)
                      .selectAll("text")
                      .style("text-anchor", "end")
                      .attr("dx", "-.8em")
                      .attr("dy", ".15em")
                      .attr("transform", "rotate(-65)");
    for (let i = 0; i < this.state.data.length; i++) {
      if (i != 0) {
        lineGroup.append("line")
                  .attr("x1",xScale(this.state.useTime?new Date(this.state.data[i-1].x):this.state.data[i-1].x))
                  .attr("y1",yScale(this.state.data[i-1].y))
                  .attr("x2",xScale(this.state.useTime?new Date(this.state.data[i-1].x):this.state.data[i-1].x))
                  .attr("y2",yScale(this.state.data[i-1].y))
                  .style("stroke", this.state.line.color)
                  .style("stroke-width", this.state.line.width)
                  .merge(lineGroup)
                  .transition()
                  .duration(this.state.animationDurations.start)
                  .attr("x2",xScale(this.state.useTime?new Date(this.state.data[i].x):this.state.data[i].x))
                  .attr("y2",yScale(this.state.data[i].y))
      }
    }

  }
  render(){
    return <svg id={this.state.id} width={this.state.width} height={this.state.height}>
      <g id={this.state.id+"_lines"} transform={"translate(" + (this.state.axisMargin.left-this.state.axisMargin.right) + "," + (this.state.axisMargin.top-this.state.axisMargin.bottom) + ")"}></g>
      <g id={this.state.id+"_points"} transform={"translate(" + (this.state.axisMargin.left-this.state.axisMargin.right) + "," + (this.state.axisMargin.top-this.state.axisMargin.bottom) + ")"}></g>
    </svg>
  }
}
