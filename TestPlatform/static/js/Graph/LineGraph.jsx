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
      point: this.props.point || [{radius: 7, color: "rgba(40,100,30,1)", border: 3, border_color: "rgba(255,240,240,1)"}],
      line: this.props.line || [{width: 3, color: "rgba(40,180,30,1)"}],
      axisMargin: this.props.axisMargin || {top:5,bottom:40,right:10,left:40},
      animationDurations: this.props.animationDurations || {start:1500,update:2000},
      timeFormat: this.props.timeFormat || "%d-%b-%Y",
      useTime: this.props.timeAsAxis || false,
      lineCount: 1
    }
    console.log(this.state.data);
  }

  componentDidMount(){
    //a debug function i use with d3 commands.
    let setAndLog = function(set,log){
      console.log(log);
      return set;
    };
    let setAndPush = function(set,arr,push){
      arr.push(push || set);
      return set;
    };
    let xScale;
    let multipleLines = true;
    let allDataOneArray = [];
    let component = this;


    //checks if the entries are arrays which declare there are multiple lines involved.
    this.state.data.forEach(function(d){
      allDataOneArray.push(...d);
      if(multipleLines){
        multipleLines = Array.isArray(d)? true : false
      }
    });
    if(this.state.useTime){
      xScale = d3.scaleTime().domain(d3.extent((multipleLines?allDataOneArray:this.state.data), function(d){ return new Date(d.x); })).range([0,this.state.width-this.state.axisMargin.right-this.state.axisMargin.left]);
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
      //checks if the same date has instanciated.
      let usedDates = [];
      xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat(this.state.timeFormat))
                                   .tickValues((multipleLines?allDataOneArray:this.state.data)
                                   .map(d =>new Date(d.x))
                                   .filter(function(e,i,arr) {
                                     let date = e.getDate()+""+e.getMonth()+""+e.getFullYear();
                                     if (usedDates.indexOf(date)<0) {
                                       usedDates.push(date);
                                       return true;
                                     }else{
                                       usedDates.push(date);
                                       return false;
                                     }
                                   }));
    }else{
      xAxis = d3.axisBottom(xScale);
    }

    if(multipleLines){
      pointGroup = d3.select("#" +this.state.id + "_points");
      this.state.data.forEach(function(e,index){
        console.log(index%(component.state.point.length));
        pointGroup.append("g")
                  .selectAll("circle")
                  .data(e)
                  .enter()
                  .append("circle")
                  .style("stroke",component.state.point[index%component.state.point.length].border_color)
                  .style("stroke-width",component.state.point[index%component.state.point.length].border)
                  .style("fill", component.state.point[index%component.state.point.length].color)
                  .attr("r", 0)
                  .attr("cx", (d) => xScale(component.state.useTime?new Date(d.x):d.x))
                  .attr("cy", (d) => yScale(d.y))
                  .merge(pointGroup)
                  .transition()
                  .duration(component.state.animationDurations.start)
                  .attr("r",component.state.point[index%component.state.point.length].radius);
        for (let i = 0; i < e.length; i++) {
          if (i != 0) {
            lineGroup.append("line")
            .attr("x1",xScale(component.state.useTime?new Date(e[i-1].x):e[i-1].x))
            .attr("y1",yScale(e[i-1].y))
            .attr("x2",xScale(component.state.useTime?new Date(e[i-1].x):e[i-1].x))
            .attr("y2",yScale(e[i-1].y))
            .style("stroke",component.state.line[index%component.state.line.length].color)
            .style("stroke-width",component.state.line[index%component.state.line.length].width)
            .merge(lineGroup)
            .transition()
            .duration(component.state.animationDurations.start)
            .attr("x2",xScale(component.state.useTime?new Date(e[i].x):e[i].x))
            .attr("y2",yScale(e[i].y))
          }
        }
      });
    }else{
      pointGroup.enter().append("circle")
                        .style("stroke", this.state.point[0].border_color)
                        .style("stroke-width", this.state.point[0].border)
                        .style("fill", this.state.point[0].color)
                        .attr("r", 0)
                        .attr("cx", (d) => xScale(this.state.useTime?new Date(d.x):d.x))
                        .attr("cy", (d) => yScale(d.y))
                        .merge(pointGroup)
                        .transition()
                        .duration(this.state.animationDurations.start)
                        .attr("r", this.state.point[0].radius);

      for (let i = 0; i < this.state.data.length; i++) {
        if (i != 0) {
          lineGroup.append("line")
          .attr("x1",xScale(this.state.useTime?new Date(this.state.data[i-1].x):this.state.data[i-1].x))
          .attr("y1",yScale(this.state.data[i-1].y))
          .attr("x2",xScale(this.state.useTime?new Date(this.state.data[i-1].x):this.state.data[i-1].x))
          .attr("y2",yScale(this.state.data[i-1].y))
          .style("stroke", this.state.line[0].color)
          .style("stroke-width", this.state.line[0].width)
          .merge(lineGroup)
          .transition()
          .duration(this.state.animationDurations.start)
          .attr("x2",xScale(this.state.useTime?new Date(this.state.data[i].x):this.state.data[i].x))
          .attr("y2",yScale(this.state.data[i].y))
        }
      }

    }

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

  }
  render(){
    return <svg id={this.state.id} width={this.state.width} height={this.state.height}>
      <g id={this.state.id+"_lines"} transform={"translate(" + (this.state.axisMargin.left-this.state.axisMargin.right) + "," + (this.state.axisMargin.top-this.state.axisMargin.bottom) + ")"}></g>
      <g id={this.state.id+"_points"} transform={"translate(" + (this.state.axisMargin.left-this.state.axisMargin.right) + "," + (this.state.axisMargin.top-this.state.axisMargin.bottom) + ")"}></g>
    </svg>
  }
}
