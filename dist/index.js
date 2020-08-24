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

var isEmpty = function isEmpty(o) {
  if (Array.isArray(o)) {
    return !o.length;
  }

  return Object.keys(o).length === 0 && o.constructor === Object;
};

var isArray = function isArray(a) {
  return Array.isArray(a);
};

var builtInValidators = {
  required: function required(value) {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (typeof value === 'number') {
      return !!value;
    }

    if (value && typeof value === 'object' && !isEmpty(value)) {
      return true;
    }

    return false;
  },
  email: function email(input) {
    return /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input);
  },
  minLength: function minLength(input, len) {
    if (!len) {
      console.warn('length is not provided');
    }

    return input.toString().length >= len;
  },
  maxLength: function maxLength(input, len) {
    if (!len) {
      console.warn('length is not provided');
    }

    return input.toString().length <= len;
  },
  minCheckboxes: function minCheckboxes(input, availableOptions) {
    if (availableOptions === void 0) {
      availableOptions = null;
    }

    if (typeof input === 'object' && isArray(input) && availableOptions && typeof availableOptions === 'number') {
      return input.length >= availableOptions;
    }

    return false;
  }
};

var checkForValidators = function checkForValidators(configValidators, builtInValidators, name, rules) {
  var _rules$customValidato;

  if (rules === null || rules === void 0 ? void 0 : (_rules$customValidato = rules.customValidators) === null || _rules$customValidato === void 0 ? void 0 : _rules$customValidato[name]) {
    return rules.customValidators[name];
  }

  if (configValidators === null || configValidators === void 0 ? void 0 : configValidators[name]) {
    return configValidators[name];
  }

  if (builtInValidators[name]) {
    return builtInValidators[name];
  } else {
    console.warn("no validation function with mane " + name);
  }
};

var getValidators = function getValidators(configValidators, builtInValidators, rules) {
  if (!rules) return;
  var f = {};

  for (var key in rules === null || rules === void 0 ? void 0 : rules.rules) {
    var t = checkForValidators(configValidators, builtInValidators, key, rules);

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
    console.warn("the field @ " + ref.outerHTML + " must have a unique name attribute");
    return undefined;
  }
};

var isRadio = function isRadio(ref) {
  return ref.type === 'radio';
};

var isCheckbox = function isCheckbox(ref) {
  return ref.type === 'checkbox';
};

var getValue = function getValue(v) {
  if (v.type === 'checkbox' || v.type === 'radio') {
    if (!v.ref) {
      if (!isEmpty(v.group) && isArray(v.group)) {
        return v.group.filter(function (e) {
          return e.current.checked;
        }).map(function (e) {
          return e.current.value;
        });
      }
    } else {
      if (v.ref.current && v.ref.current.checked) {
        return v.ref.current.value;
      } else {
        return null;
      }
    }
  }

  if (v.ref.current) {
    return v.ref.current.value;
  }

  return null;
};

var isEmptyValue = function isEmptyValue(v) {
  if (typeof v === 'object' && v !== null) {
    return isEmpty(v);
  }

  if (typeof v === 'number') {
    return !(v || v === 0);
  }

  if (typeof v === 'string') {
    return !v.trim();
  }

  if (v) {
    return false;
  }

  return true;
};

var getHierarchyProperties = function getHierarchyProperties(inputOptions, globalOptions, key) {
  var _inputOptions, _globalOptions;

  if (inputOptions === void 0) {
    inputOptions = null;
  }

  if (globalOptions === void 0) {
    globalOptions = null;
  }

  return ((_inputOptions = inputOptions) === null || _inputOptions === void 0 ? void 0 : _inputOptions[key]) || ((_globalOptions = globalOptions) === null || _globalOptions === void 0 ? void 0 : _globalOptions[key]) || undefined;
};

var throwWarning = function throwWarning(value) {
  return function (warning) {
    if (!value) console.warn(warning);
    return value;
  };
};

var hasKey = function hasKey(obj, key) {
  return obj && key in obj;
};

var useValidator = function useValidator(config) {
  var elements = react.useRef(new Map());
  var touchedElements = react.useRef(new Map());
  var dirtyElements = react.useRef(new Map());
  var errors = react.useRef({});
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

      elements.current.forEach(function (value) {
        fieldValidation(value);
      });
      triedToSubmit.current = true;

      if (formValidity.current !== prevFormValidity) {
        rerender({});
        return;
      }

      fn && fn();
    };
  };

  react.useEffect(function () {
    elements.current.forEach(function (value) {
      var val = getValue(value);
      if (isEmptyValue(val)) return;
      fieldValidation(value);
    });
  }, []);

  var fieldValidation = function fieldValidation(elem) {
    var _isValid = true;

    var previousErrorState = _extends({}, errors.current);

    var _ref = elements.current.get(elem.name) || {},
        fieldRules = _ref.fieldRules,
        validators = _ref.validators,
        name = _ref.name;

    var _ref2 = fieldRules || {},
        rules = _ref2.rules,
        messages = _ref2.messages,
        options = _ref2.options;

    if (rules && name) {
      for (var key in validators) {
        var validator = validators[key];
        var availableOptions = getHierarchyProperties(options, config === null || config === void 0 ? void 0 : config.globalOptions, key);
        var value = getValue(elem);

        if (rules[key] && !validator(value, availableOptions)) {
          var _errors$current;

          _isValid = false;
          if (hasKey((_errors$current = errors.current) === null || _errors$current === void 0 ? void 0 : _errors$current[name], key)) continue;
          shouldRerender.current = true;
          var errorMsg = throwWarning(getHierarchyProperties(messages, config === null || config === void 0 ? void 0 : config.globalMessages, key))("no @ " + key + " error message anywhere for " + name + " input.");
          errors.current[name] = errors.current[name] || {};
          errors.current[name][key] = errorMsg;
          elements.current.set(name, _extends({}, elements.current.get(name), {
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
            elements.current.set(name, _extends({}, elements.current.get(name), {
              valid: true
            }));
          }
        }
      }
    }

    if (!_isValid) {
      formValidity.current = false;
    }

    if (isEmpty(errors.current) && !isEmpty(previousErrorState)) {
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
      var _ref$current;

      e.stopPropagation();
      var name = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.name;

      if (!dirtyElements.current.has(ref.current)) {
        dirtyElements.current.set(ref.current, null);
      }

      if (!triedToSubmit.current && (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit)) return;
      var t = elements.current.get(name);
      fieldValidation(t);
    };
  };

  var detectChange = function detectChange(ref) {
    return function (e) {
      var _ref$current2;

      e.stopPropagation();
      if (!triedToSubmit.current && (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit)) return;
      var name = (_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.name;
      var t = ref.current && elements.current.get(name);
      fieldValidation(t);
    };
  };

  var track = function track(elem, rules) {
    var _ref$current4;

    if (!elem) return;
    var ref = react.createRef();
    ref.current = elem;
    var name = hasNameAttribute(ref.current);
    if (!name) return;
    var isRadioOrCheckbox = isRadio(ref.current) || isCheckbox(ref.current);
    var e = elements.current.get(name);

    if (!elements.current.has(name) || !((e === null || e === void 0 ? void 0 : e.group) && e.group.some(function (elem) {
      return elem.current === ref.current;
    }))) {
      var _ref$current3;

      if (isRadio(ref.current) || isCheckbox(ref.current) || ((_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.type) === 'range') {
        ref.current && ref.current.addEventListener('change', detectChange(ref));
      } else {
        ref.current && ref.current.addEventListener('focus', detectTouch(ref));
        ref.current && ref.current.addEventListener('input', detectInput(ref));
      }
    }

    var validators = getValidators(config === null || config === void 0 ? void 0 : config.customValidators, builtInValidators, rules);

    var dataFields = elements.current.get(name) || _extends({
      valid: true
    }, rules && {
      fieldRules: rules
    }, validators && {
      validators: validators
    }, {
      type: (_ref$current4 = ref.current) === null || _ref$current4 === void 0 ? void 0 : _ref$current4.type,
      name: name
    }, isRadioOrCheckbox && {
      checked: false
    }, isRadioOrCheckbox && {
      group: []
    }, {
      ref: ref
    });

    if (elements.current.has(name)) {
      if (dataFields.ref && dataFields.group) {
        dataFields.group.push(dataFields.ref);
      }

      if (dataFields.group && !dataFields.group.some(function (elem) {
        return elem.current === ref.current;
      })) {
        dataFields.group.push(ref);
        delete dataFields.ref;
      }
    }

    elements.current.set(name, dataFields);
  };

  var detectTouch = function detectTouch(ref) {
    return function () {
      var _ref$current5;

      touchedElements.current.set((_ref$current5 = ref.current) === null || _ref$current5 === void 0 ? void 0 : _ref$current5.name, null);
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
