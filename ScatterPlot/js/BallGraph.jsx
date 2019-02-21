import React from 'react';
const d3 = require('d3');

let colors = ["#173f5f","#20639b","#3caea3","#f6d55c","#ed553b"];

function generateRandomData(items){
  let returnData = [];

  for(let i = 0;i < items;i++){
    returnData.push({x: Math.random(),y: Math.random(),r: Math.random(),color: i%5})
    console.log(returnData[i])
  }
  return returnData;
}

export default class BallGraph extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      data: this.props.data || generateRandomData( 20 + Math.floor(20 * Math.random()))
    }
    this.handleClick = this.handleClick.bind(this);
    this.updateStyleAndAttrs = this.updateChart.bind(this);
  }

  handleClick(){
    this.setState({
      data: generateRandomData( 20 + Math.floor(20 * Math.random()))
    });
  }

  updateChart(){
    let maxRadius = 50;
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
    .style('fill', d => colors[d.color])
    .merge(graph)
    .transition()
    .duration(1000)
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', d => rScale(d.r))
    .style('fill', d => colors[d.color]);

    graph.exit().remove();
  }

  componentDidMount(){
    this.updateChart();
  }

  componentDidUpdate(){
    this.updateChart();
  }


  render(){

    return <div>
          <svg id={this.props.id} width={this.props.width} height={this.props.height}></svg>
          <button onClick={this.handleClick}>Update</button>
        </div>
  }
}
