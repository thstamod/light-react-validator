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
  required: function required(input) {
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
  var name = ref.name;

  if (name) {
    return name;
  } else {
    console.warn("the field " + ref.outerHTML + " must have a unique name attribute");
    return undefined;
  }
};

var isRadio = function isRadio(ref) {
  return ref.type === 'radio';
};

var findElementsWithSameName = function findElementsWithSameName(elements, name) {
  var sn = [];
  elements.current.forEach(function (value, key) {
    value.name === name && sn.push(key);
  });
  return sn.length ? sn : null;
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
  var customConfiguration = react.useRef({});
  var triedToSubmit = react.useRef(false);
  var formValidity = react.useRef(true);
  var shouldRerender = react.useRef(false);

  var _useState = react.useState(),
      rerender = _useState[1];

  var submitForm = function submitForm(fn) {
    return function (e) {
      e.preventDefault();
      var prevFormValidity = formValidity.current;

      if (elements.current.size !== dirtyElements.current.size) {
        dirtyElements.current = new Map(elements.current);
      }

      elements.current.forEach(function (_value, key) {
        fieldValidation(key);
      });
      triedToSubmit.current = true;

      if (formValidity.current !== prevFormValidity) {
        rerender({});
        return;
      }

      fn();
    };
  };

  react.useEffect(function () {
    if (config === null || config === void 0 ? void 0 : config.customValidators) {
      customValidators.current = config.customValidators;
    }

    if (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit) {
      customConfiguration.current.validateFormOnSubmit = true;
    }
  }, []);

  var fieldValidation = function fieldValidation(ref) {
    var _isValid = true;

    var _ref = elements.current.get(ref) || {},
        fieldRules = _ref.fieldRules,
        validators = _ref.validators,
        name = _ref.name;

    var _ref2 = fieldRules || {},
        rules = _ref2.rules,
        messages = _ref2.messages;

    if (rules && name) {
      for (var key in validators) {
        var validator = validators[key];

        if (rules[key] && !validator(ref === null || ref === void 0 ? void 0 : ref.value)) {
          var _errors$current, _errors$current$name;

          _isValid = false;
          if ((_errors$current = errors.current) === null || _errors$current === void 0 ? void 0 : (_errors$current$name = _errors$current[name]) === null || _errors$current$name === void 0 ? void 0 : _errors$current$name[key]) continue;
          shouldRerender.current = true;

          if (name in errors.current) {
            errors.current[name][key] = messages === null || messages === void 0 ? void 0 : messages[key];
          } else {
            var _extends2;

            errors.current[name] = _extends((_extends2 = {}, _extends2[key] = messages === null || messages === void 0 ? void 0 : messages[key], _extends2), errors.current[name]);
          }

          elements.current.set(ref, _extends({}, elements.current.get(ref), {
            valid: false
          }));
        } else {
          var _errors$current2, _errors$current2$name, _errors$current3, _errors$current3$name, _errors$current4;

          if (!((_errors$current2 = errors.current) === null || _errors$current2 === void 0 ? void 0 : (_errors$current2$name = _errors$current2[name]) === null || _errors$current2$name === void 0 ? void 0 : _errors$current2$name[key])) continue;
          shouldRerender.current = true;
          (_errors$current3 = errors.current) === null || _errors$current3 === void 0 ? true : (_errors$current3$name = _errors$current3[name]) === null || _errors$current3$name === void 0 ? true : delete _errors$current3$name[key];

          if (!isEmpty(errors === null || errors === void 0 ? void 0 : errors.current) && isEmpty(errors === null || errors === void 0 ? void 0 : (_errors$current4 = errors.current) === null || _errors$current4 === void 0 ? void 0 : _errors$current4[name])) {
            var _errors$current5, _errors$current6;

            isEmpty((_errors$current5 = errors.current) === null || _errors$current5 === void 0 ? void 0 : _errors$current5[name]) && ((_errors$current6 = errors.current) === null || _errors$current6 === void 0 ? true : delete _errors$current6[name]);
            errors.current = _extends({}, errors.current);
            elements.current.set(ref, _extends({}, elements.current.get(ref), {
              valid: true
            }));
          }
        }
      }
    }

    if (!_isValid) {
      formValidity.current = false;
    }

    if (isEmpty(errors.current)) {
      shouldRerender.current = true;
      formValidity.current = true;
    }

    if (shouldRerender.current) {
      shouldRerender.current = false;
      rerender({});
    }
  };

  var detectInput = function detectInput(ref) {
    return function (e) {
      e.stopPropagation();

      if (!dirtyElements.current.has(ref.current)) {
        dirtyElements.current.set(ref.current, null);
      }

      if (!triedToSubmit.current && customConfiguration.current.validateFormOnSubmit) return;
      fieldValidation(ref.current);
    };
  };

  var detectChange = function detectChange(ref) {
    return function (e) {
      var _ref$current;

      e.stopPropagation();
      var name = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.name;

      if (isRadio(ref.current) && name) {
        console.log(findElementsWithSameName(elements, name));
      }
    };
  };

  var track = function track(elem, rules) {
    var _ref$current2, _ref$current3;

    if (!elem) return;
    var ref = react.createRef();
    ref.current = elem;

    if (((_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.type) === 'radio') {
      ref.current && ref.current.addEventListener('change', detectChange(ref));
    } else {
      if (elements.current.has(ref.current)) return;
      ref.current && ref.current.addEventListener('focus', detectTouch(ref));
      ref.current && ref.current.addEventListener('input', detectInput(ref));
    }

    var validators = getValidators(customValidators.current, builtInValidators, rules);
    var name = hasNameAttribute(ref.current);

    var dataFields = _extends({
      valid: true
    }, rules && {
      fieldRules: rules
    }, validators && {
      validators: validators
    }, {
      type: (_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.type,
      name: name
    }, isRadio(ref.current) && {
      checked: false
    }, isRadio(ref.current) && {
      group: []
    });

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
    errors: errors.current,
    formValidity: formValidity.current
  };
};

exports.useValidator = useValidator;
//# sourceMappingURL=index.js.map
