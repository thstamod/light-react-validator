import { useRef, useState, createRef } from 'react';

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
  minLength: (input, len) => input.toString().length >= len,
  maxLength: (input, len) => input.toString().length <= len,
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
    console.warn(`the field ${ref.outerHTML} must have a unique name attribute`);
    return undefined;
  }
};

const isRadio = ref => ref.type === 'radio';

const isCheckbox = ref => ref.type === 'checkbox';

const getValue = (v, _type) => {
  if (isArray(v)) {
    return v.filter(e => e.current.checked).map(e => e.current.value);
  }

  if (v.current.checked) {
    return v.current.value;
  }

  return null;
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

    fn();
  };

  const fieldValidation = elem => {
    let _isValid = true;
    const {
      fieldRules,
      validators,
      name,
      type
    } = elements.current.get(elem.name) || {};
    const {
      rules,
      messages,
      options
    } = fieldRules || {};

    if (rules && name) {
      for (const key in validators) {
        var _elem$ref$current;

        const validator = validators[key];
        const availableOptions = options && options[key];
        const value = type === 'text' ? (_elem$ref$current = elem.ref.current) === null || _elem$ref$current === void 0 ? void 0 : _elem$ref$current.value : getValue(!isEmpty(elem.group) ? elem.group : elem.ref);

        if (rules[key] && !validator(value, availableOptions)) {
          var _errors$current, _errors$current$name;

          _isValid = false;
          if ((_errors$current = errors.current) === null || _errors$current === void 0 ? void 0 : (_errors$current$name = _errors$current[name]) === null || _errors$current$name === void 0 ? void 0 : _errors$current$name[key]) continue;
          shouldRerender.current = true;

          if (name in errors.current) {
            errors.current[name][key] = messages === null || messages === void 0 ? void 0 : messages[key];
          } else {
            errors.current[name] = {
              [key]: messages === null || messages === void 0 ? void 0 : messages[key],
              ...errors.current[name]
            };
          }

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

    if (isEmpty(errors.current)) {
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
    var _ref$current3;

    if (!elem) return;
    const ref = createRef();
    ref.current = elem;
    const name = hasNameAttribute(ref.current);
    if (!name) return;
    const isRadioOrCheckbox = isRadio(ref.current) || isCheckbox(ref.current);
    const e = elements.current.get(name);

    if (!elements.current.has(name) || !((e === null || e === void 0 ? void 0 : e.group) && e.group.some(elem => elem.current === ref.current))) {
      if (isRadio(ref.current) || isCheckbox(ref.current)) {
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
      type: (_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.type,
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
    touchedElements.current.set(ref, null);
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
