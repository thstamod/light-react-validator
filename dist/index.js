var react = require('react');

var useValidator = function useValidator() {
  var _useState = react.useState(null),
      state = _useState[0],
      setstate = _useState[1];

  var ref = react.useRef(null);

  var track = function track(elem, rules) {
    ref.current = elem;
    setstate(ref);
  };

  react.useEffect(function () {
    ref.current.onkeydown = function (e) {
      return console.log(e.target.value);
    };
  }, [state]);
  return [track];
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
