import React from 'react';
import * as d3 from 'd3';

export default class SelectionSystem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id : this.props.id || "SelectionSystem_" + Date.getTime(),
      //This will return the elements based on these functions.
      //Note: these delegates are just arrays with functions.
      accesEntries: [
        ...this.props.accesEntriesDelegate || ...[function(){return null}]
      ],
      //This is a event that will trigger when you select a element.
      onSelectEntry: [
        ...this.props.selectEntriesDelegate || ...[function(){}]
      ],
      //This is a event that will trigger when you unSelect a element.
      onUnselectEntry: [
        ...this.props.unselectEntriesDelegate || ...[function(){}]
      ],
      //Holds all the elements that can be selected.
      elements: [

      ],
      //Holds the elements that are selected.
      selectedElements: [

      ]
    }
  }
  //Note: the parameters parameter is a object that holds the parameter for the function.
  callDelegate(delegate,parameters){
    let give = [];
    let functypes = [];
    delegate.forEach((d,i) => {
      //check the return types
      let type = typeof(d());
      functypes.push(type);
    });

    if(functypes.every((d) => d == functypes[0])){
      let type = functypes[0];
      switch (type) {
        case 'undefined':
            delegate.forEach(function(d){
              if(parameters){
                d({...parameters});
              }else{
                d();
              }
            });
          break;
        default:
            delegate.forEach(function(d){
              give.push({data: d({...parameters})});
            });
          return give;
      }
    }else{
      console.log("Cannot call delegate it is not viable because of return type difference");
    }
  }

  getSelectedElements(){
    let elements = [];
    this.state.elements.forEach(function(d,i){
      elements.push({name: this.state.graphs[i].getAttribute("id"),data:[]);
      this.state.elements[i].data.forEach(function(e){
        if(e.getAttribute("selected")){
          elements[i].data.push(e);
        }
      });
    });
    console.log(elements);
    return elements;
  }

  componentDidMount(){
    let elements = callDelegate(this.state.accesEntries,null);
    let component = this;
    elements.forEach(function(d,i){
      d.data.forEach(function(e,j){
        d3.select(e)
          .attr('selected', false)
          .on('mousedown',function(){
            if(e.getAttribute("selected")){
              component.state.onSelectEntry[i]({element: e, elements: component.state.elements, selected: component.state.selectedElements});
            }else{
              component.state.onUnselectEntry[i]({element: e, elements: component.state.elements, selected: component.state.selectedElements});
            }
          })
          ;
      })
    });

    this.setState({
      ...this.state,
      elements: elements
    })
  }

  componentDidUpdate(){
    this.setState({
      ...this.state,
      selectedElements: getSelectedElements();
    });
  }

  render(){
    return null;
  }

}
