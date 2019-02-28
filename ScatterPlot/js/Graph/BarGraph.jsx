import React from "react";
import InfoBlock from "./InfoBlock"
const d3 = require('d3');

export default class BarGraph extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      height: this.props.height || 500,
      width: this.props.width || 500,
      margin: this.props.margin || 5,
      maxScale: this.props.maxValue || {x:this.props.width,y:this.props.height},
      transitionTime: this.props.transitionTime || 1500,
      color: this.props.palette || ["darkblue","lightgreen"],
      tooltip: {
        x:0,
        y:0,
        display: false,
        color: this.props.tooltip.color || "#afafaf",
        html: this.props.tooltip.html || <p>I'm a p element</p>,
        width: this.props.tooltip.width || 70,
        height: this.props.tooltip.height || 35,
        margin: this.props.tooltip.margin || 5,
        border_width: this.props.tooltip.border_width || 1,
        border_color: this.props.tooltip.border_color || "#333333",
      }
    };
  }

  updateTooltip(d){
    this.setState({
      tooltip:{
        ...this.state.tooltip,
        x: Math.min(this.state.width-this.state.tooltip.width,Math.max(this.state.tooltip.width+d.mouseX,0)) || this.state.tooltip.x,
        y: Math.min(this.state.height-this.state.tooltip.height,Math.max(this.state.tooltip.height+d.mouseY,0)) || this.state.tooltip.y,
        display: d.display || false,
        html: d.html || this.state.tooltip.html
      }
    })
  }

  //These generate bars with the d3 libary
  //NOTE: They don't actually return anything,
  //they just search for the id of the svg element
  //and d3 does all the work in the way you loop through the svg elements.
  generateBars (){
    //Scales
    let xScale = d3.scaleLinear().domain([0,this.state.maxScale.x]).range([0,this.state.width]);
    let yScale = d3.scaleLinear().domain([0,this.state.maxScale.y]).range([0,this.state.height]);
    //returns a color within a range
    let cScale = d3.scaleLinear().domain([0,this.state.maxScale.c]).range([this.state.color[0],this.state.color[1]]);

    //Calculating the width of the bars including margin
    let barWidth = (this.state.width - 2*(this.state.margin*this.props.data.length)+this.state.margin)/this.props.data.length;
    //initialises the canvas
    let yAxis = d3.axisLeft(d3.scaleLinear().domain([this.state.maxScale.y,0]).range([0,this.state.height]));

    let canvas = d3.select("#" + this.state.id)
                   .select("." + this.props.id + "_group")
                   .attr("transform", "translate(" + (this.state.width/10+"") + ",5)")
                   .call(yAxis)
                   .selectAll('rect')
                   .data(this.props.data);


    //draws the svg and after the merge function it will activate its animation
    canvas.enter()
          .append('rect')
          .attr('class', this.props.id + "_rect")
          .attr("width", barWidth)
          .attr("height", d => yScale(d.income))
          .attr("x", (d,i) => this.state.margin + (barWidth*(i)+this.state.margin*(i)))
          .attr("y", (d) => this.state.height)
          .merge(canvas)
          .transition()
          .duration(this.state.transitionTime)
          .attr("width", barWidth)
          .attr("height", d => yScale(d.income))
          .attr("x", (d,i) => this.state.margin + (barWidth*(i)+this.state.margin*(i)))
          .attr("y", d => this.state.height-yScale(d.income))
          .style("fill", d => cScale(d.income))

    let component = this;
    let display,mouseX,mouseY,html;

    let bars = d3.select("#"+this.props.id).select("." + this.props.id + "_group").selectAll("." + this.props.id + '_rect')
                  .on("mouseover", function(d,i){
                    display = true;
                    mouseX = d3.event.pageX;
                    mouseY = d3.event.pageY;
                    html = <p style={{
                      color: "black",
                      fontSize: "10px" ,
                    }}>
                    {d.person + " :" + d.income}
                    </p>;
                    component.updateTooltip({display:display, mouseX:mouseX,mouseY:mouseY,html:html});
                  })
                  .on("mousemove", function(d,i){
                    mouseX = d3.event.pageX;
                    mouseY = d3.event.pageY;
                    display = true;
                    component.updateTooltip({display:display,mouseX:mouseX,mouseY:mouseY,html:html});
                  })
                  .on("mouseout", function(d,i){
                    display = false;
                    component.updateTooltip({display:display,mouseX:mouseX,mouseY:mouseY,html:html});
                  })
    canvas.exit().remove();
  }

  componentDidMount(){
    this.generateBars();
  }

  componentDidUpdate(){
    if(this.props.data != this.state.data){
      this.generateBars();
    }
  }
  //Check if the svg elements are loaded in, so it can render to the front layer.
  isSvgLoaded(){
    if(d3.select("#" + this.props.id).select("." + this.props.id + "_group").empty()){
      return null;
    }else{
      return <InfoBlock id={this.props.id + "_tooltip"} position={{x:this.state.tooltip.x, y: this.state.tooltip.y}}
                 display={this.state.tooltip.display}
                 html={this.state.tooltip.html}
                 color={this.state.tooltip.color}
                 border_color={this.state.tooltip.border_color}
                 border_width={this.state.tooltip.border_width}/>
    };
  }

  render () {
    return(
        <svg id={this.props.id} height={this.state.height} width={this.state.width}>
          <g class={this.props.id + "_group"}>
          </g>
          {this.isSvgLoaded()}
        </svg>
    )
  }
}
