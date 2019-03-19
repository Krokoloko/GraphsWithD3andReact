import React from 'react';
import * as d3 from 'd3';

export default class SelectionSystem extends React.Component{
  constructor(props){
    super(props);
    let time = new Date();
    this.state = {
      id : this.props.id || "SelectionSystem_" + time.getTime(),
      //This will return the elements based on these functions.
      //Note: these delegates are just arrays with functions.
      accesEntries: [
        ...this.props.accesEntriesDelegate || [function(){return null}]
      ],
      toggleEntry: [
        ...this.props.onToggleEntryDelegate || [function(){}]
      ],
      //This is a event that will trigger when you select a element.
      onSelectEntry: [
        ...this.props.selectEntriesDelegate || [function(){}]
      ],
      //This is a event that will trigger when you unSelect a element.
      onUnselectEntry: [
        ...this.props.unselectEntriesDelegate || [function(){}]
      ],
      //Holds all the elements that can be selected.
      elements: [

      ],
      //Holds the elements that are selected.
      selectedElements: [

      ]
    }
  }
  //Note: the parameters parameter is a object that holds the parameters for the function.
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
    let component = this;
    this.state.elements.forEach(function(d,i){
      elements.push({data:[]});
      d.data.forEach(function(e){
        console.log(e.getAttribute("selected"));
        if(e.getAttribute("selected") == "true"){
          elements[i].data.push(e);
        }
      });
    });
    console.log("elements that are selected");
    console.log(elements);
    return elements;
  }

  componentDidMount(){
    let elements = this.callDelegate(this.state.accesEntries,null);
    let component = this;
    elements.forEach(function(d,i){
      d.data.forEach(function(e,j){
        d3.select(e)
          .attr('selected', false)
          .on('mousedown',function(){
            if(e.getAttribute("selected") == "false"){
              component.state.onToggle[i]({element: e, elements: component.state.elements, selected: component.state.selectedElements});
              component.state.onSelectEntry[i]({element: e, elements: component.state.elements, selected: component.state.selectedElements});
              component.setState({
                ...component.state,
                selectedElements: component.getSelectedElements()
              });
            }else{
              component.state.onToggle[i]({element: e, elements: component.state.element, selected: component.state.selectedElements});
              component.state.onUnselectEntry[i]({element: e, elements: component.state.elements, selected: component.state.selectedElements});
              component.setState({
                ...component.state,
                selectedElements: component.getSelectedElements()
              });
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

  }

  render(){
    return null;
  }

}
