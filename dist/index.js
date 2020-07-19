var react = require('react');

var useValidator = function useValidator() {
  var elements = react.useRef(new Map());
  var touchedElements = react.useRef(new Map());
  var dirtyElements = react.useRef(new Map());
  var errors = react.createRef({});

  var submitForm = function submitForm(fn) {
    return function (e) {
      e.preventDefault();
      console.log('validator formSubmit');
      fn();
    };
  };

  var track = function track(elem, rules) {
    var ref = react.createRef(null);
    ref.current = elem;
    elements.current.set(elem, {
      touched: false,
      dirty: false,
      value: null,
      valid: true,
      rules: rules
    });
    ref.current.onchange = partialOnChange(ref);
    ref.current.onfocus = partialOnFocus(ref);
  };

  var partialOnChange = function partialOnChange(ref) {
    return function (e) {
      return console.log('second onChange ', e.target.value, ref);
    };
  };

  var partialOnFocus = function partialOnFocus(ref) {
    return function (e) {
      touchedElements.current.set(ref);
      ref.current.onfocus = '';
      console.log('second onFocus ', e.target.value, ref);
    };
  };

  return [track, submitForm, errors];
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
