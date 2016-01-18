var React = require('react');
var ReactDOM = require('react-dom');
var RadonSelect = require('../src/select.jsx');

var App = React.createClass({
  displayName: "App",
  getInitialState() {
    return {
      carValue: "bmw"
    };
  },
  onCarChange(val) {
    this.setState({
      carValue: val
    });
  },
  setCarValue(ev) {
    ev.preventDefault();
    this.refs.car.setValue(React.findDOMNode(this.refs.newCar).value.trim());
  },
  render() {
    return (
      <div>
        <h3>Basic</h3>
        <RadonSelect selectName="foo">
          <RadonSelect.Option value="who">Who</RadonSelect.Option>
          <RadonSelect.Option value="what">What</RadonSelect.Option>
        </RadonSelect>
        <br />
        <br />
        <h3>Placeholder Text</h3>
        <RadonSelect selectName="month" placeholderText="MM">
          <RadonSelect.Option value="01">01</RadonSelect.Option>
          <RadonSelect.Option value="02">02</RadonSelect.Option>
          <RadonSelect.Option value="03">03</RadonSelect.Option>
          <RadonSelect.Option value="04">04</RadonSelect.Option>
          <RadonSelect.Option value="05">05</RadonSelect.Option>
          <RadonSelect.Option value="06">06</RadonSelect.Option>
          <RadonSelect.Option value="07">07</RadonSelect.Option>
          <RadonSelect.Option value="08">08</RadonSelect.Option>
          <RadonSelect.Option value="09">09</RadonSelect.Option>
          <RadonSelect.Option value="10">10</RadonSelect.Option>
          <RadonSelect.Option value="11">11</RadonSelect.Option>
          <RadonSelect.Option value="12">12</RadonSelect.Option>
        </RadonSelect>
        {"/"}
        <RadonSelect selectName="year" placeholderText="YY">
          <RadonSelect.Option value="16">16</RadonSelect.Option>
          <RadonSelect.Option value="17">17</RadonSelect.Option>
          <RadonSelect.Option value="18">18</RadonSelect.Option>
          <RadonSelect.Option value="19">19</RadonSelect.Option>
          <RadonSelect.Option value="20">20</RadonSelect.Option>
        </RadonSelect>
        <br />
        <br />
        <h3>Get and set values</h3>
        <RadonSelect ref="fruits" selectName="fruits" defaultValue="apple">
          <RadonSelect.Option value="apple">
            <h1 style={{margin:"0px"}}>apple</h1>
          </RadonSelect.Option>
          <RadonSelect.Option value="orange">
            <h1 style={{margin:"0px"}}>orange</h1>
          </RadonSelect.Option>          
        </RadonSelect>
        <br />
        <br />
        <h3>Get and set values</h3>
        <RadonSelect ref="car" selectName="car" defaultValue={this.state.carValue} onChange={this.onCarChange}>
          <RadonSelect.Option value="audi">audi</RadonSelect.Option>
          <RadonSelect.Option value="bmw">bmw</RadonSelect.Option>
          <RadonSelect.Option value="infiniti">infiniti</RadonSelect.Option>
          <RadonSelect.Option value="lexus">lexus</RadonSelect.Option>
          <RadonSelect.Option value="mercedes">mercedes</RadonSelect.Option>
        </RadonSelect>
        <br />
        <span>{"Current value: " + this.state.carValue}</span>
        <br />
        <span>Set value:
          <form onSubmit={this.setCarValue}>
            <input ref="newCar"/>
            <button type="submit">set</button>
          </form>
        </span>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
