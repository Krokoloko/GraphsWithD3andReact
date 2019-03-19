import React from 'react';
import InfoBlock from './InfoBlock';
import * as d3 from 'd3';

export default class BallGraph extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      data: this.props.data,
      tooltip: {
                x:0,
                y:0,
                display: false,
                color: this.props.tooltip.color || "#333333",
                html: this.props.tooltip.html || <p>I'm a p element</p>,
                width: this.props.tooltip.width || 70,
                height: this.props.tooltip.height || 35,
                margin: this.props.tooltip.margin || 5,
                border_color: this.props.tooltip.border_color || "#eeeeee",
                border_width: this.props.tooltip.border_width || 1
              }
    }
    console.log(this.state.data);
  }

  updateTooltip(d){
    this.setState({
      tooltip: {
        x: Math.min(this.props.width-this.state.tooltip.width,Math.max(d.mouseX,0)) || this.state.tooltip.x,
        y: Math.min(this.props.height-this.state.tooltip.height,Math.max(d.mouseY,0)) || this.state.tooltip.y,
        display: d.display,
        html: d.html || this.state.tooltip.html,
        width: this.state.tooltip.width,
        height: this.state.tooltip.height,
        margin: this.state.tooltip.margin
      }
    });
  }

  initialiseChart(){
    let maxRadius = (this.props.width * this.props.height)/10000;
    let minRadius = maxRadius*0.6;
    let xScale = d3.scaleLinear().domain([0,1]).range([maxRadius,this.props.width-maxRadius]);
    let yScale = d3.scaleLinear().domain([0,1]).range([maxRadius,this.props.height-maxRadius]);
    let rScale = d3.scaleLinear().domain([0,1]).range([minRadius, maxRadius]);

    let graph = d3.select("#" + this.props.id)
    .selectAll('circle')
    .data(this.state.data);
    console.log(graph);
    graph.enter()
    .append('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 0)
    .style('fill', (d,i) => this.props.palette[i%this.props.palette.length])
    .merge(graph)
    .transition()
    .duration(1000)
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', d => rScale(d.r))
    .attr('class', (d,i) => this.props.id+'circle')
    .style('fill', (d,i) => this.props.palette[i%this.props.palette.length]);

    let component = this;
    let mouseX,mouseY,display,html;

    let circles = d3.select("#"+this.props.id).selectAll('circle')
                      .on('mouseover',function(d,i){
                        display = true;
                        html = <p style={{
                          color: "#ff00ff"
                        }}>{d.name}</p>;
                        mouseX = d3.event.offsetX;
                        mouseY = d3.event.offsetY;
                        component.updateTooltip({display:display,mouseX:mouseX-component.state.tooltip.width + component.state.tooltip.margin
                                               ,mouseY:mouseY-component.state.tooltip.height+component.state.tooltip.margin,html:html})
                      })
                      .on('mouseout',function(d,i){
                        display = false;
                        component.updateTooltip({display:display,mouseX:mouseX-component.state.tooltip.width + component.state.tooltip.margin
                                               ,mouseY:mouseY-component.state.tooltip.height+component.state.tooltip.margin,html:html})
                      })
                      .on('mousemove',function(d,i){
                        mouseX = d3.event.offsetX;
                        mouseY = d3.event.offsetY;
                        display = true;
                        html = <p style={{
                          color: "#ff00ff"
                        }}>{d.name}</p>;
                        component.updateTooltip({display:display,mouseX:mouseX - component.state.tooltip.width + component.state.tooltip.margin
                                               ,mouseY:mouseY-component.state.tooltip.height + component.state.tooltip.margin,html:html})
                      });
    graph.exit().remove();
  }

  isSvgLoaded(){
    if(d3.select("#" + this.props.id).empty()){
      console.log("empty");
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

  componentDidMount(){
    this.initialiseChart();
  }
  componentDidUpdate(){

  }

  render(){
    return (<svg id={this.props.id} width={this.props.width} height={this.props.height}>
             {this.isSvgLoaded()}
           </svg>)
  }
}
