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

      for (var el in elements.current) {
        fieldValidation(elements.current[el]);
      }

      fn();
    };
  };

  react.useEffect(function () {
    if (config === null || config === void 0 ? void 0 : config.customValidators) {
      customValidators.current = config.customValidators;
    }
  }, []);

  var fieldValidation = function fieldValidation(ref) {
    var _isValid = true;

    var _elements$current$get = elements.current.get(ref.current),
        fieldRules = _elements$current$get.fieldRules;

    var validators = getValidators(fieldRules, customValidators.current, builtInValidators);
    console.log(validators);
    var rules = fieldRules.rules,
        messages = fieldRules.messages;

    for (var key in validators) {
      var _ref$current;

      var validator = validators[key];
      var name = ref.current.name;

      if (rules[key] && !validator(ref === null || ref === void 0 ? void 0 : (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.value)) {
        var _extends2;

        errors.current[name] = _extends((_extends2 = {}, _extends2[key] = messages === null || messages === void 0 ? void 0 : messages[key], _extends2), errors.current[name]);
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
      if (!dirtyElements.current.has(ref)) {
        dirtyElements.current.set(ref, null);
        return;
      }

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
    ref.current = elem;
    ref.current.addEventListener('focus', partialOnFocus(ref));
    ref.current.addEventListener('input', keyup(ref));
    if (elements.current.has(ref)) return;

    var dataFields = _extends({
      valid: true
    }, rules && {
      fieldRules: rules
    });

    elements.current.set(elem, dataFields);
  };

  var partialOnFocus = function partialOnFocus(ref) {
    return function () {
      console.log('partial focus');
      touchedElements.current.set(ref, null);
      ref.current.onfocus = '';
    };
  };

  return {
    track: track,
    submitForm: submitForm,
    errors: errors.current
  };
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
