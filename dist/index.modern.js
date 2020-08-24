import { useRef, useState, useEffect, createRef } from 'react';

const isEmpty = o => {
  if (Array.isArray(o)) {
    return !o.length;
  }

  return Object.keys(o).length === 0 && o.constructor === Object;
};

const isArray = a => Array.isArray(a);

var builtInValidators = {
  required: value => {
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
  email: input => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLength: (input, len) => {
    if (!len) {
      console.warn('length is not provided');
    }

    return input.toString().length >= len;
  },
  maxLength: (input, len) => {
    if (!len) {
      console.warn('length is not provided');
    }

    return input.toString().length <= len;
  },
  minCheckboxes: (input, availableOptions = null) => {
    if (typeof input === 'object' && isArray(input) && availableOptions && typeof availableOptions === 'number') {
      return input.length >= availableOptions;
    }

    return false;
  }
};

const checkForValidators = (configValidators, builtInValidators, name, rules) => {
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
    console.warn(`no validation function with mane ${name}`);
  }
};

const getValidators = (configValidators, builtInValidators, rules) => {
  if (!rules) return;
  const f = {};

  for (const key in rules === null || rules === void 0 ? void 0 : rules.rules) {
    const t = checkForValidators(configValidators, builtInValidators, key, rules);

    if (t) {
      f[key] = t;
    }
  }

  return f;
};

const hasNameAttribute = ref => {
  const name = ref.name;

  if (name) {
    return name;
  } else {
    console.warn(`the field @ ${ref.outerHTML} must have a unique name attribute`);
    return undefined;
  }
};

const isRadio = ref => ref.type === 'radio';

const isCheckbox = ref => ref.type === 'checkbox';

const getValue = v => {
  if (v.type === 'checkbox' || v.type === 'radio') {
    if (!v.ref) {
      if (!isEmpty(v.group) && isArray(v.group)) {
        return v.group.filter(e => e.current.checked).map(e => e.current.value);
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

const isEmptyValue = v => {
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

const getHierarchyProperties = (inputOptions = null, globalOptions = null, key) => (inputOptions === null || inputOptions === void 0 ? void 0 : inputOptions[key]) || (globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions[key]) || undefined;

const throwWarning = value => warning => {
  if (!value) console.warn(warning);
  return value;
};

const hasKey = (obj, key) => {
  return obj && key in obj;
};

const useValidator = config => {
  const elements = useRef(new Map());
  const touchedElements = useRef(new Map());
  const dirtyElements = useRef(new Map());
  const errors = useRef({});
  const triedToSubmit = useRef(false);
  const formValidity = useRef(true);
  const shouldRerender = useRef(false);
  const [, rerender] = useState();

  const submitForm = fn => e => {
    e.preventDefault();
    const prevFormValidity = formValidity.current;

    if (elements.current.size !== dirtyElements.current.size) {
      dirtyElements.current = new Map(elements.current);
    }

    elements.current.forEach(value => {
      fieldValidation(value);
    });
    triedToSubmit.current = true;

    if (formValidity.current !== prevFormValidity) {
      rerender({});
      return;
    }

    fn && fn();
  };

  useEffect(() => {
    elements.current.forEach(value => {
      const val = getValue(value);
      if (isEmptyValue(val)) return;
      fieldValidation(value);
    });
  }, []);

  const fieldValidation = elem => {
    let _isValid = true;
    const previousErrorState = { ...errors.current
    };
    const {
      fieldRules,
      validators,
      name
    } = elements.current.get(elem.name) || {};
    const {
      rules,
      messages,
      options
    } = fieldRules || {};

    if (rules && name) {
      for (const key in validators) {
        const validator = validators[key];
        const availableOptions = getHierarchyProperties(options, config === null || config === void 0 ? void 0 : config.globalOptions, key);
        const value = getValue(elem);

        if (rules[key] && !validator(value, availableOptions)) {
          var _errors$current;

          _isValid = false;
          if (hasKey((_errors$current = errors.current) === null || _errors$current === void 0 ? void 0 : _errors$current[name], key)) continue;
          shouldRerender.current = true;
          const errorMsg = throwWarning(getHierarchyProperties(messages, config === null || config === void 0 ? void 0 : config.globalMessages, key))(`no @ ${key} error message anywhere for ${name} input.`);
          errors.current[name] = errors.current[name] || {};
          errors.current[name][key] = errorMsg;
          elements.current.set(name, { ...elements.current.get(name),
            valid: false
          });
        } else {
          var _errors$current2, _errors$current2$name, _errors$current3, _errors$current3$name, _errors$current4;

          if (!((_errors$current2 = errors.current) === null || _errors$current2 === void 0 ? void 0 : (_errors$current2$name = _errors$current2[name]) === null || _errors$current2$name === void 0 ? void 0 : _errors$current2$name[key])) continue;
          shouldRerender.current = true;
          (_errors$current3 = errors.current) === null || _errors$current3 === void 0 ? true : (_errors$current3$name = _errors$current3[name]) === null || _errors$current3$name === void 0 ? true : delete _errors$current3$name[key];

          if (!isEmpty(errors === null || errors === void 0 ? void 0 : errors.current) && isEmpty(errors === null || errors === void 0 ? void 0 : (_errors$current4 = errors.current) === null || _errors$current4 === void 0 ? void 0 : _errors$current4[name])) {
            var _errors$current5, _errors$current6;

            isEmpty((_errors$current5 = errors.current) === null || _errors$current5 === void 0 ? void 0 : _errors$current5[name]) && ((_errors$current6 = errors.current) === null || _errors$current6 === void 0 ? true : delete _errors$current6[name]);
            errors.current = { ...errors.current
            };
            elements.current.set(name, { ...elements.current.get(name),
              valid: true
            });
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

  const detectInput = ref => e => {
    var _ref$current;

    e.stopPropagation();
    const name = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.name;

    if (!dirtyElements.current.has(ref.current)) {
      dirtyElements.current.set(ref.current, null);
    }

    if (!triedToSubmit.current && (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit)) return;
    const t = elements.current.get(name);
    fieldValidation(t);
  };

  const detectChange = ref => e => {
    var _ref$current2;

    e.stopPropagation();
    if (!triedToSubmit.current && (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit)) return;
    const name = (_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.name;
    const t = ref.current && elements.current.get(name);
    fieldValidation(t);
  };

  const track = (elem, rules) => {
    var _ref$current4;

    if (!elem) return;
    const ref = createRef();
    ref.current = elem;
    const name = hasNameAttribute(ref.current);
    if (!name) return;
    const isRadioOrCheckbox = isRadio(ref.current) || isCheckbox(ref.current);
    const e = elements.current.get(name);

    if (!elements.current.has(name) || !((e === null || e === void 0 ? void 0 : e.group) && e.group.some(elem => elem.current === ref.current))) {
      var _ref$current3;

      if (isRadio(ref.current) || isCheckbox(ref.current) || ((_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.type) === 'range') {
        ref.current && ref.current.addEventListener('change', detectChange(ref));
      } else {
        ref.current && ref.current.addEventListener('focus', detectTouch(ref));
        ref.current && ref.current.addEventListener('input', detectInput(ref));
      }
    }

    const validators = getValidators(config === null || config === void 0 ? void 0 : config.customValidators, builtInValidators, rules);
    const dataFields = elements.current.get(name) || {
      valid: true,
      ...(rules && {
        fieldRules: rules
      }),
      ...(validators && {
        validators
      }),
      type: (_ref$current4 = ref.current) === null || _ref$current4 === void 0 ? void 0 : _ref$current4.type,
      name: name,
      ...(isRadioOrCheckbox && {
        checked: false
      }),
      ...(isRadioOrCheckbox && {
        group: []
      }),
      ref
    };

    if (elements.current.has(name)) {
      if (dataFields.ref && dataFields.group) {
        dataFields.group.push(dataFields.ref);
      }

      if (dataFields.group && !dataFields.group.some(elem => elem.current === ref.current)) {
        dataFields.group.push(ref);
        delete dataFields.ref;
      }
    }

    elements.current.set(name, dataFields);
  };

  const detectTouch = ref => () => {
    var _ref$current5;

    touchedElements.current.set((_ref$current5 = ref.current) === null || _ref$current5 === void 0 ? void 0 : _ref$current5.name, null);
    ref.current && ref.current.removeEventListener('focus', detectTouch(ref), true);
  };

  return {
    track: track,
    submitForm: submitForm,
    errors: errors.current,
    formValidity: formValidity.current
  };
};

export { useValidator };
//# sourceMappingURL=index.modern.js.map
