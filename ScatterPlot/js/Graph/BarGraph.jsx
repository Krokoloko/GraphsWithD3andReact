import React from "react";
import InfoBlock from "./InfoBlock"
const d3 = require('d3');

export default class BarGraph extends React.Component{

  arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
  }

  constructor(props){
    super(props);
    this.state = {
      height: this.props.height || 500,
      width: this.props.width || 500,
      barMargin: this.props.barMargin || 5,
      maxScale: this.props.maxValue || {x:this.props.width,y:this.props.height},
      transitionTime: this.props.transitionTime || 1500,
      color: this.props.palette || ["darkblue","lightgreen"],
      oldSelected:  Array(this.props.data.length).fill(false),
      selected: Array(this.props.data.length).fill(false),
      axis:{
        margin:{
          x: this.props.axis.margin.x || 20,
          y: this.props.axis.margin.y || 40
        },
        textRotation: this.props.textRotation || 45
      },
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

  lowerAplha(c,b,bools){
    let loweredColor = c;
    let tru;
    bools.forEach(function(e){
      if(!e && !tru){
        tru = false;
      }else{
        tru = true;
      }
    });
    if(!b && tru){
      let split = c.split("(");
      loweredColor = split[0].concat("a","(").concat(loweredColor.slice(c.indexOf("(")+1,c.length-1).concat(",0.4",")"));
      return loweredColor;
    }else{
      return c;
    }
  }

  updateEvents(){
    let component = this;
    let display,mouseX,mouseY,html;

    let bars = d3.select("#"+this.props.id).select("." + this.props.id + "_group")
                                           .selectAll("." + this.props.id + '_rect')
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
                                                  .on("mousedown", function(d,i){
                                                    let selections = component.state.selected;
                                                    selections[i] = !component.state.selected[i];
                                                    component.setState({
                                                      selected: selections,
                                                    });
                                                    })
  }

  //These generate bars with the d3 libary
  //NOTE: They don't actually return anything,
  //they just search for the id of the svg element
  //and d3 does all the work in the way you loop through the svg elements.
  initialiseBars (){

    //Scales
    let xScale = d3.scaleLinear().domain([0,this.state.maxScale.x]).range([0,this.state.width-this.state.axis.margin.x]);
    let yScale = d3.scaleLinear().domain([0,this.state.maxScale.y]).range([0,this.state.height]);

    //returns a color within a range
    let cScale = d3.scaleLinear().domain([0,this.state.maxScale.c]).range([this.state.color[0],this.state.color[1]]);

    //Calculating the width of the bars including margin
    let barWidth = (this.state.width - 2*(this.state.barMargin*this.props.data.length)+this.state.barMargin)/this.props.data.length;

    let yAxis = d3.axisLeft(d3.scaleLinear().domain([this.state.maxScale.y,0]).range([0,this.state.height]));



    let axis = d3.select("#" + this.props.id)
                 .select("." + this.props.id + "_group")
                 .select("." + this.props.id + "_rectangles")
                 .call(yAxis);


    let canvas = d3.select("#" + this.props.id)
                   .select("." + this.props.id + "_group")
                   .attr("transform", "translate(" + this.state.axis.margin.x + ","+ -(this.state.axis.margin.y) +")")
                   .select("." + this.props.id + "_rectangles")
                   .selectAll('rect')
                   .data(this.props.data);

    let labels = d3.select("#" + this.props.id)
                   .select("." + this.props.id + "_group")
                   .select("." + this.props.id + "_labels")
                   .selectAll("text")
                   .data(this.props.data);
    //draws the svg and after the merge function it will activate its animation
    canvas.enter()
          .append('rect')
          .attr('class', this.props.id + "_rect")
          .attr("width", barWidth)
          .attr("height", 0)
          .attr("x", (d,i) => this.state.barMargin + (barWidth*(i)+this.state.barMargin*(i)))
          .attr("y", this.state.height)
          .style("fill", (d,i) => cScale(d.income))
          .merge(canvas)
          .transition()
          .duration(this.state.transitionTime)
          .attr("width", barWidth)
          .attr("height", d => yScale(d.income))
          .attr("x", (d,i) => this.state.barMargin + (barWidth*(i)+this.state.barMargin*(i)))
          .attr("y", d => this.state.height-yScale(d.income))
          .style("fill", (d,i) => cScale(d.income));

    labels.enter()
          .append("text")
          .attr("class", this.props.id + "_label")
          .attr("transform",(d,i) => "translate(" + (this.state.barMargin+barWidth*i+this.state.barMargin*i) +
          "," +  (this.state.height+this.state.axis.margin.y*0.2) + ")rotate("+ this.state.axis.textRotation +")")
          .text(d => d.person)
          ;

    let component = this;
    let display,mouseX,mouseY,html;

    this.updateEvents();

    canvas.exit().remove();
  }

  updateBarColors(){
    let cScale = d3.scaleLinear().domain([0,this.state.maxScale.c]).range([this.state.color[0],this.state.color[1]]);

    let canvas = d3.select("#" + this.props.id)
                   .select("." + this.props.id + "_group")
                   .select("." + this.props.id + "_rectangles")
                   .selectAll('rect')
                   .data(this.props.data);

    let transitionAplha = canvas.enter()
                                  .style("fill", d3.select(this))
                                  .merge(canvas)
                                  .transition()
                                  .duration(500)
                                  .style("fill",(d,i) => this.lowerAplha(cScale(d.income),this.state.selected[i],this.state.selected,d3.select(this)));
  }


  componentDidMount(){
    this.initialiseBars();
  }

  componentDidUpdate(){
    // console.log("update");
    this.updateEvents();
    if(!this.arraysEqual(this.state.selected, this.state.oldSelected)){
      this.updateBarColors();
      console.log("update old state");
      this.setState({
        oldSelected: [...this.state.selected]
      })
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
            <g class={this.props.id + "_rectangles"}>

            </g>
            <g class={this.props.id + "_labels"}>

            </g>
          </g>
          {this.isSvgLoaded()}
        </svg>
    )
  }
}
