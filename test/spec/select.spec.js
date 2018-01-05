'use strict';

describe('Button', function () {

  var React = require('react');
  var ReactDOM = require('react-dom');
  var TestUtils = require('react-dom/test-utils');

  var RadonSelect = require('select.jsx');
  var container, component;

  describe('Mounting', function() {

    beforeEach(function() {
      container = document.createElement('div');
      component = ReactDOM.render(
        React.createElement(RadonSelect, {selectName: "test"}, [
          React.createElement(RadonSelect.Option, {key: "blah"}, "blah"),
          React.createElement(RadonSelect.Option, {key: "foo"}, "foo")
        ]),
        container
      );
    });

    afterEach(function() {
      ReactDOM.unmountComponentAtNode(container);
    });

    it('should render into the document', function() {
        expect(component.isMounted()).to.be.true;
    });
  });
});
