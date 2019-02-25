import React from 'react';
import InfoBlock from './InfoBlock';
const d3 = require('d3');



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
                color: "#a9d423",
                html:<p>I'm a p element</p>
              }
    }
    this.updateChart = this.updateChart.bind(this);
  }

  updateTooltip(d){
    this.setState({
      tooltip: {
        x: d.mouseX || 0,
        y: d.mouseY || 0,
        display: d.display|| false,
        html: d.html || <p>I'm a p element</p>
      }
    });
  }

  updateChart(){
    let maxRadius = (this.props.width * this.props.height)/10000;
    let xScale = d3.scaleLinear().domain([0,1]).range([maxRadius,this.props.width-maxRadius]);
    let yScale = d3.scaleLinear().domain([0,1]).range([maxRadius,this.props.height-maxRadius]);
    let rScale = d3.scaleLinear().domain([0,1]).range([maxRadius/10, maxRadius]);

    let graph = d3.select("#" + this.props.id)
    .selectAll('circle')
    .data(this.state.data);
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
    .style('fill', (d,i) => this.props.palette[i%this.props.palette.length])
    .style('z-index', (d) => '-1');

    let thisthis = this;
    let mouseX,mouseY,display,html;

    let circles = d3.select("#"+this.props.id).selectAll('circle')
                      .on('mouseover',function(d,i){
                        console.log(this);
                        console.log(d3.event);
                        display = true;
                        html = <p style={{
                          color: "#ff00ff"
                        }}>{d.x*10}</p>;
                        mouseX = d3.event.pageX;
                        mouseY = d3.event.pageY;
                        thisthis.updateTooltip({display:display,mouseX:mouseX,mouseY:mouseY,html:html})
                      })
                      .on('mouseout',function(d,i){
                        console.log("mouse out");
                        display = false;
                        // html = <p style={{
                        //   color: "#ff00ff"
                        // }}>{d.x*10}</p>;
                        // mouseX = d3.event.pageX;
                        // mouseY = d3.event.pageY;
                        thisthis.updateTooltip({display:display,mouseX:0,mouseY:0,html:html})

                      })
                      .on('mousemove',function(d,i){
                        mouseX = d3.event.pageX;
                        mouseY = d3.event.pageY;
                        html = <p style={{
                          color: "#ff00ff"
                        }}>{d.x*10}</p>;
                        display = true;
                        thisthis.updateTooltip({display:display,mouseX:mouseX,mouseY:mouseY,html:html})

                      });
    graph.exit().remove();
  }

  isSvgLoaded(){
    if(d3.select("#" + this.props.id).empty()){
      return null;
    }else{
      return <InfoBlock id={this.props.id + "_tooltip"} position={{x:this.state.tooltip.x, y: this.state.tooltip.y}}
                 display={this.state.tooltip.display}
                 html={this.state.tooltip.html}
                 color={this.props.color}
                 border_color="#000000"
                 border_width="1px"
                 zIndex="-2"/>
    };
  }

  componentDidMount(){
    this.updateChart();
  }
  componentDidUpdate(){
    if(this.props.data != this.state.data){
      this.updateChart();
    }
  }

  render(){
    return (<svg id={this.props.id} width={this.props.width} height={this.props.height}>
             {this.isSvgLoaded()}
           </svg>)
  }
}
