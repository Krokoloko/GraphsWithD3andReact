import React from 'react';
import * as d3 from 'd3';

export default class InfoBlock extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      html: this.props.html || <p style={{color: "#ffffff"}}>I'm a P</p> ,
      width: this.props.width || 70,
      height : this.props.height || 35,
      x: this.props.position.x || 100,
      y: this.props.position.y || 100,
    }
  }

  render(){
      return(<g>
              <rect x={this.props.position.x} y={this.props.position.y}
                    width={this.state.width} height={this.state.height}
                    style={{
                              display: this.props.display ? 'inline' : 'none',
                              fill: this.props.color || "#00001f",
                              stroke_width: this.props.border_width || "1px",
                              stroke: this.props.border_color || "#fff0ff",
                           }}
                    class={this.props.id}>
              </rect>
              <foreignObject width={this.state.width} height={this.state.height}
              x={this.props.position.x} y={this.props.position.y}
              style={{
                display : this.props.display ? 'inline' : 'none',
              }}
              class={this.props.id}>
                {this.props.html}
              </foreignObject>
             </g>);
  }
}
