var react = require('react');

var useValidator = function useValidator() {
  var elements = react.useRef(new Map());
  var ref = react.useRef(null);

  var track = function track(elem, rules) {
    console.log(elem, rules);
    console.log(elements);
    ref.current = elem;
    elements.current.set(elem, {
      touched: false,
      dirty: false,
      value: null,
      valid: true,
      rules: rules
    });

    ref.current.onchange = function (e) {
      return console.log('second onChange ', e.target.value);
    };
  };

  return [track];
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
