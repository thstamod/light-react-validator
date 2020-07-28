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

var checkForValidators = function checkForValidators(configValidators, builtInValidators, name, data) {
  var _data$customValidator;

  if (data === null || data === void 0 ? void 0 : (_data$customValidator = data.customValidators) === null || _data$customValidator === void 0 ? void 0 : _data$customValidator[name]) {
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

var getValidators = function getValidators(configValidators, builtInValidators, data) {
  if (!data) return;
  var f = {};

  for (var key in data === null || data === void 0 ? void 0 : data.rules) {
    var t = checkForValidators(configValidators, builtInValidators, key, data);

    if (t) {
      f[key] = t;
    }
  }

  return f;
};

var hasNameAttribute = function hasNameAttribute(ref) {
  var name = ref.current.name;

  if (name) {
    return name;
  } else {
    var _ref$current;

    throw new Error("the field " + ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.outerHTML) + " must have a unique name attribute");
  }
};

var isEmpty = function isEmpty(o) {
  if (Array.isArray(o)) {
    return !o.length;
  }

  return Object.keys(o).length === 0 && o.constructor === Object;
};

var useValidator = function useValidator(config) {
  var elements = react.useRef(new Map());
  var touchedElements = react.useRef(new Map());
  var dirtyElements = react.useRef(new Map());
  var errors = react.useRef({});
  var customValidators = react.useRef(null);

  var _useState = react.useState(),
      rerender = _useState[1];

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
    var prev = elements.current.get(ref.current);
    var _isValid = true;

    var _elements$current$get = elements.current.get(ref.current),
        fieldRules = _elements$current$get.fieldRules,
        validators = _elements$current$get.validators;

    var rules = fieldRules.rules,
        messages = fieldRules.messages;

    for (var key in validators) {
      var _ref$current;

      var validator = validators[key];
      var name = hasNameAttribute(ref);

      if (rules[key] && !validator(ref === null || ref === void 0 ? void 0 : (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.value)) {
        var _extends2;

        errors.current[name] = _extends((_extends2 = {}, _extends2[key] = messages === null || messages === void 0 ? void 0 : messages[key], _extends2), errors.current[name]);
        elements.current.set(ref.current, _extends({}, prev, {
          valid: false
        }));
        _isValid = false;
      } else {
        var _errors$current, _errors$current$name, _errors$current2, _errors$current3;

        (_errors$current = errors.current) === null || _errors$current === void 0 ? true : (_errors$current$name = _errors$current[name]) === null || _errors$current$name === void 0 ? true : delete _errors$current$name[key];
        isEmpty((_errors$current2 = errors.current) === null || _errors$current2 === void 0 ? void 0 : _errors$current2[name]) && ((_errors$current3 = errors.current) === null || _errors$current3 === void 0 ? true : delete _errors$current3[name]);
        errors.current = _extends({}, errors.current);
        elements.current.set(ref.current, _extends({}, prev, {
          valid: true
        }));
        _isValid = true;
      }
    }

    console.log(_isValid);

    if (prev !== elements.current.get(ref.current)) {
      rerender({});
    }
  };

  var detectInput = function detectInput(ref) {
    return function (e) {
      e.stopPropagation();

      if (!dirtyElements.current.has(ref)) {
        dirtyElements.current.set(ref, null);
        return;
      }

      fieldValidation(ref);
    };
  };

  var track = function track(elem, rules) {
    if (!elem) return;
    var ref = react.createRef();
    ref.current = elem;
    if (elements.current.has(ref.current)) return;
    ref.current && ref.current.addEventListener('focus', detectTouch(ref));
    ref.current && ref.current.addEventListener('input', detectInput(ref));
    var validators = getValidators(customValidators.current, builtInValidators, rules);

    var dataFields = _extends({
      valid: true
    }, rules && {
      fieldRules: rules
    }, validators && {
      validators: validators
    });

    console.log(elements);
    elements.current.set(ref.current, dataFields);
  };

  var detectTouch = function detectTouch(ref) {
    return function () {
      touchedElements.current.set(ref, null);
      ref.current && ref.current.removeEventListener('focus', detectTouch(ref), true);
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
