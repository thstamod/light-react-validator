var react = require('react');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var builtInValidators = {
  require: function require(input) {
    return input.trim().length > 0;
  },
  email: function email(input) {
    return /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input);
  },
  minLen: function minLen(input, len) {
    return input.toString().length < len;
  }
};

var useValidator = function useValidator(config) {
  console.log('rerender useValidator');
  var elements = react.useRef(new Map());
  var touchedElements = react.useRef(new Map());
  var dirtyElements = react.useRef(new Map());
  var errors = react.useRef({});
  var customValidators = react.useRef(null);

  var _useState = react.useState(true),
      validity = _useState[0],
      setValidity = _useState[1];

  var submitForm = function submitForm(fn) {
    return function (e) {
      e.preventDefault();
      console.log('validator formSubmit');

      for (var _iterator = _createForOfIteratorHelperLoose(elements), _step; !(_step = _iterator()).done;) {
        var el = _step.value;
        fieldValidation(el);
      }

      fn();
    };
  };

  react.useEffect(function () {
    if (config.customValidators) {
      customValidators.current = config.customValidators;
    }
  }, []);

  var fieldValidation = function fieldValidation(ref) {
    var _isValid = true;

    var _elements$current$get = elements.current.get(ref.current),
        data = _elements$current$get.data;

    var validators = getValidators(data, customValidators.current, builtInValidators);
    var rules = data.rules,
        msgs = data.msgs;

    for (var key in validators) {
      var validator = validators[key];
      var name = ref.current.name;

      if (rules[key] && !validator(ref.current.value)) {
        var _extends2;

        errors.current[name] = _extends((_extends2 = {}, _extends2[key] = msgs === null || msgs === void 0 ? void 0 : msgs[key], _extends2), errors.current[name]);
        _isValid = false;
      } else {
        var _errors$current, _errors$current$name;

        console.log(errors.current[name]);
        (_errors$current = errors.current) === null || _errors$current === void 0 ? true : (_errors$current$name = _errors$current[name]) === null || _errors$current$name === void 0 ? true : delete _errors$current$name[key];
        _isValid = true;
      }
    }

    return _isValid;
  };

  var keyup = function keyup(ref) {
    return function (e) {
      console.log(e);

      if (!dirtyElements.current.has(ref)) {
        dirtyElements.current.set(ref);
        return;
      }

      console.log(e);
      var v = fieldValidation(ref);

      if (validity !== v) {
        setValidity(function (v) {
          return !v;
        });
      }
    };
  };

  var getValidators = function getValidators(data, configValidators, builtInValidators) {
    if (!data) return;
    var f = {};

    for (var key in data === null || data === void 0 ? void 0 : data.rules) {
      console.log(key);
      var t = checkForValidators(data, configValidators, builtInValidators, key);
      console.log(t);

      if (t) {
        f[key] = t;
      }
    }

    return f;
  };

  var checkForValidators = function checkForValidators(data, configValidators, builtInValidators, name) {
    var _data$customValidator;

    if ((_data$customValidator = data.customValidators) === null || _data$customValidator === void 0 ? void 0 : _data$customValidator[name]) {
      return data.customValidators[name];
    }

    if (configValidators === null || configValidators === void 0 ? void 0 : configValidators[name]) {
      return configValidators[name];
    }

    if (builtInValidators[name]) {
      return builtInValidators[name];
    } else {
      throw new Error("no validation function with mane " + name);
    }
  };

  var track = function track(elem, rules) {
    if (!elem) return;
    var ref = react.createRef();
    if (elements.current.has(ref)) return;
    ref.current = elem;
    elements.current.set(elem, _extends({
      valid: true
    }, rules && {
      data: rules
    }));
    ref.current.addEventListener('focus', partialOnFocus(ref));
    ref.current.addEventListener('input', keyup(ref));
  };

  var partialOnFocus = function partialOnFocus(ref) {
    return function (e) {
      console.log('partial focus');
      touchedElements.current.set(ref);
      ref.current.onfocus = '';
    };
  };

  return [track, submitForm, errors.current];
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
