'use strict';
var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');

var keyboard = {
  space: 32,
  enter: 13,
  escape: 27,
  tab: 9,
  upArrow: 38,
  downArrow: 40
};

var doesOptionMatch = function (option, s) {
  s = s.toLowerCase();

  // Check that passed in option wraps a string, if it wraps a component, match val
  if (typeof option.props.children === 'string') {
    return option.props.children.toLowerCase().indexOf(s) === 0;
  } else {
    return option.props.value.tolowerCase().indexOf(s) === 0;
  }
}

var classBase = React.createClass({
  displayName: 'RadonSelect',
  propTypes: {
    children: function (props, propName) {
      if (!props[propName] || !Array.isArray(props[propName])) {
        return new Error('children must be an array of RadonSelect.Option');
      }

      props[propName].forEach(function (child) {
        if (child.type.displayName !== 'RadonSelectOption') {
          return new Error('children must be an array of RadonSelect.Option');
        }
      });
    },
    selectName: React.PropTypes.string.isRequired,
    // TODO
    defaultValue: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    typeaheadDelay: React.PropTypes.number,
    onChange: React.PropTypes.func,
    // Should there just be a baseClassName that these are derived from?
    className: React.PropTypes.string,
    openClassName: React.PropTypes.string,
    focusClassName: React.PropTypes.string,
    listClassName: React.PropTypes.string,
    currentOptionClassName: React.PropTypes.string,
    hiddenSelectClassName: React.PropTypes.string
  },
  getDefaultProps:function () {
    return {
      typeaheadDelay: 1000,
      onChange: function () {},
      className: 'radon-select',
      openClassName: 'open',
      focusClassName: 'focus',
      listClassName: 'radon-select-list',
      currentOptionClassName: 'radon-select-current',
      hiddenSelectClassName: 'radon-select-hidden-select'
    };
  },
  getInitialState:function () {
    return {
      selectedOptionIndex: false,
      selectedOptionVal: this.props.children[0].props.value,
      open: false,
      focus: false
    };
  },
  getValue:function () {
    return this.state.selectedOptionVal;
  },
  setValue:function (val, silent) {
    for (var i = 0; i < this.props.children.length; i++) {
      if (this.props.children[i].props.value === val) {
        this.setState({
          selectedOptionIndex: i,
          selectedOptionVal: val
        }, function () {
          if (!silent) {
            this.props.onChange(this.state.selectedOptionVal);
          }
        });

        break;
      }
    }
  },
  onChange:function () {
    this.props.onChange(this.state.selectedOptionVal);
  },
  moveIndexByOne:function (decrement) {
    var selectedOptionIndex = this.state.selectedOptionIndex || 0;
    // Don't go out of array bounds
    if (decrement && this.state.selectedOptionIndex === 0 ||
      !decrement && this.state.selectedOptionIndex === this.props.children.length - 1) {
      return;
    }

    selectedOptionIndex += decrement ? -1 : 1

    this.setState({
      selectedOptionIndex: selectedOptionIndex,
      selectedOptionVal: this.props.children[selectedOptionIndex].props.value
    }, function () {
      this.onChange();

      if (this.state.open) {
        React.findDOMNode(this.refs['option' + this.state.selectedOptionIndex]).focus();
      }
    });
  },
  typeahead:function (character) {
    var self = this;
    var matchFound = false;
    var currentIndex = 0;

    // If we've got a selectedOptionIndex start at the next one (with wrapping), or start at 0
    if (this.state.selectedOptionIndex !== false &&
      this.state.selectedOptionIndex !== this.props.children.length - 1) {
      currentIndex = this.state.selectedOptionIndex + 1;
    }

    clearTimeout(self.typeaheadCountdown);

    this.typingAhead = true;
    this.currentString = this.currentString ? this.currentString + character : character;

    // Browser will match any other instance starting from the currently selected index and wrapping.
    for (var i = currentIndex; i < this.props.children.length; i++) {
      if (doesOptionMatch(this.props.children[i], this.currentString)) {
        matchFound = i;
        break;
      }
    }

    // If we didn't find a match in the loop from current index to end, check from 0 to current index
    if (!matchFound) {
      for (var j = 0; j <= currentIndex; j++) {
        if (doesOptionMatch(this.props.children[j], this.currentString)) {
          matchFound = j;
          break;
        }
      }
    }

    if (matchFound !== false) {
      this.setState({
        selectedOptionIndex: matchFound,
        selectedOptionVal: this.props.children[matchFound].props.value
      }, function () {
        this.onChange();

        if (this.state.open) {
          React.findDOMNode(this.refs['option' + this.state.selectedOptionIndex]).focus();
        }
      });
    }

    self.typeaheadCountdown = setTimeout(function () {
      self.typeaheadCountdown = undefined;
      self.typingAhead = false;
      self.currentString = '';
    }, this.props.typeaheadDelay)
  },
  toggleOpen:function () {
    this.setState({
      open: !this.state.open,
      selectedOptionIndex: this.state.selectedOptionIndex || 0
    }, function () {
      this.onChange();

      if (!this.state.open) {
        React.findDOMNode(this.refs['currentOption']).focus(); //eslint-disable-line dot-notation
      } else {
        React.findDOMNode(this.refs['option' + (this.state.selectedOptionIndex || 0)]).focus();
      }
    });
  },
  onFocus:function () {
    this.setState({
      focus: true
    });
  },
  onBlur:function () {
    this.setState({
      focus: false
    });
  },
  // Arrow keys are only captured by onKeyDown not onKeyPress
  // http://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
  onKeyDown:function (ev) {
    var isArrowKey = ev.keyCode === keyboard.upArrow || ev.keyCode === keyboard.downArrow;

    if (this.state.open) {
      ev.preventDefault();

      //charcode is enter, esc, or not typingahead and space
      if (ev.keyCode === keyboard.enter ||
        ev.keyCode === keyboard.escape ||
        !this.typingAhead && ev.keyCode === keyboard.space) {

        this.toggleOpen();
      } else if (isArrowKey) {
        this.moveIndexByOne(/*decrement*/ ev.keyCode === keyboard.upArrow);
        // If not tab, assume alphanumeric
      } else if (ev.keyCode !== keyboard.tab) {
        this.typeahead(String.fromCharCode(ev.keyCode));
      }
    } else {
      if (ev.keyCode === keyboard.space || isArrowKey) {
        ev.preventDefault();
        this.toggleOpen();
      // If not tab, escape, or enter, assume alphanumeric
      } else if (ev.keyCode !== keyboard.enter ||
        ev.keyCode !== keyboard.escape ||
        ev.keyCode !== keyboard.tab) {
        this.typeahead(String.fromCharCode(ev.keyCode));
      }
    }
  },
  onClickOption:function (index) {
    var child = this.refs['option' + index];

    this.setState({
      selectedOptionIndex: index,
      selectedOptionVal: child.props.value,
      open: false
    }, function () {
      this.onChange();

      React.findDOMNode(this.refs['currentOption']).focus(); //eslint-disable-line dot-notation
    });
  },
  getWrapperClasses:function () {
    var wrapperClassNames = [this.props.className];

    if (this.state.open) {
      wrapperClassNames.push(this.props.openClassName);
    }

    if (this.state.focus) {
      wrapperClassNames.push(this.props.focusClassName);
    }

    return wrapperClassNames.join(' ');
  },
  renderChild:function (child, index) {
    return cloneWithProps(child, {
      key: index,
      ref: 'option' + index,
      isActive: this.state.selectedOptionIndex === index,
      onClick: this.onClickOption.bind(this, index),
      onKeyDown: this.onKeyDown
    });
  },
  renderSpacerChild:function (child, index) {
    return cloneWithProps(child, {
      key: index
    });
  },
  render:function () {
    var selectedOptionContent = this.state.selectedOptionIndex !== false &&
      this.props.children[this.state.selectedOptionIndex].props.children;

    return (
      React.createElement("div", {
        className: this.getWrapperClasses(), 
        style: this.props.style}, 
        React.createElement("div", {
          ref: "currentOption", 
          className: this.props.currentOptionClassName, 
          tabIndex: 0, 
          role: "button", 
          onFocus: this.onFocus, 
          onKeyDown: this.onKeyDown, 
          onBlur: this.onBlur, 
          onClick: this.toggleOpen, 
          "aria-expanded": this.state.open}, 
          selectedOptionContent || this.props.placeholderText || this.props.children[0].props.children
        ), 
        this.state.open ?
          React.createElement("div", {className: this.props.listClassName, onBlur: this.toggleOpen}, 
            React.Children.map(this.props.children, this.renderChild)
          )
          : '', 
        
        React.createElement("select", {name: this.props.selectName, value: this.state.selectedOptionVal, className: this.props.hiddenSelectClassName, tabIndex: -1, "aria-hidden": true}, 
          React.Children.map(this.props.children.map, function (child, index) {
            return React.createElement("option", {key: index, value: child.props.value}, child.props.children)
          })
        ), 
        React.createElement("span", {"aria-hidden": true, style: {visibility: 'hidden'}, tabIndex: -1}, 
          React.createElement("div", {style: {visibility: 'hidden', height: 0, position: 'relative'}}, 
            React.Children.map(this.props.children, this.renderSpacerChild)
          )
        )
      )
    );
  }
});

classBase.Option = React.createClass({
  displayName: 'RadonSelectOption',
  propTypes: {
    // TODO: Disabled
    value: React.PropTypes.string.isRequired,
    children: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },
  getDefaultProps:function () {
    return {
      value: '',
      className: 'radon-select-option',
      activeClassName: 'active',
      hoverClassName: 'hover',
      onClick:function () {}
    };
  },
  getInitialState:function () {
    return {
      hovered: false
    };
  },
  getClassNames:function () {
    var classNames = [this.props.className];

    if (this.props.isActive) {
      classNames.push(this.props.activeClassName);
    }

    if (this.state.hovered) {
      classNames.push(this.props.hoverClassName);
    }

    return classNames.join(' ');
  },
  setHover:function (isHover) {
    this.setState({
      hovered: isHover
    });
  },
  onBlur:function (ev) {
    ev.stopPropagation();
  },
  render:function () {
    return (
      // Safari ignores tabindex on buttons, and Firefox ignores tabindex on anchors
      // use a <div role="button">.
      React.createElement("div", {
        role: "button", 
        className: this.getClassNames(), 
        tabIndex: -1, 
        onClick: this.props.onClick, 
        onMouseEnter: this.setHover.bind(this, true), 
        onMouseLeave: this.setHover.bind(this, false), 
        onBlur: this.onBlur, 
        onKeyDown: this.props.onKeyDown}, 
        this.props.children
      )
    );
  }
});

module.exports = classBase;
