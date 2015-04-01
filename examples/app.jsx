var React = require('react');
var RadonSelect = require('../lib/select.js');

var App = React.createClass({
  displayName: "App",
  render() {
    return (
      <div>
        <h3>Basic</h3>
        <RadonSelect>
          <RadonSelect.Option value="who">Who</RadonSelect.Option>
          <RadonSelect.Option value="what">What</RadonSelect.Option>
        </RadonSelect>
        <br />
        <br />
        <h3>Placeholder Text</h3>
        <RadonSelect placeholderText="MM">
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
        <RadonSelect placeholderText="YY">
          <RadonSelect.Option value="16">16</RadonSelect.Option>
          <RadonSelect.Option value="17">17</RadonSelect.Option>
          <RadonSelect.Option value="18">18</RadonSelect.Option>
          <RadonSelect.Option value="19">19</RadonSelect.Option>
          <RadonSelect.Option value="20">20</RadonSelect.Option>
        </RadonSelect>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('root'));