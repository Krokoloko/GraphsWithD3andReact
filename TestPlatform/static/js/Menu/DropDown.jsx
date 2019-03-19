import React from 'react';

export default class DropDown extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: this.props.items,
    }
  }

  componentDidMount(){
    this.setState({
      items: this.props.items,
    })
  }

  instanciateItems(){
    let options = [];
    for (let i = 0; i < this.state.items.length; i++) {
      options.push(<option name={this.state.items[i]}>{this.state.items[i]}</option>)
    }
    return options;
  }

  render(){
    return (
      <select onChange={this.props.onChange}>
        {this.instanciateItems()}
      </select>
    )
  }
}
