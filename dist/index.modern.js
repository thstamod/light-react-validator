import { useRef, useState, useEffect, createRef } from 'react';

var builtInValidators = {
  required: input => input.trim().length > 0,
  email: input => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input, len) => input.toString().length < len
};

const checkForValidators = (configValidators, builtInValidators, name, data) => {
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
    throw new Error(`no validation function with mane ${name}`);
  }
};

const getValidators = (configValidators, builtInValidators, data) => {
  if (!data) return;
  const f = {};

  for (const key in data === null || data === void 0 ? void 0 : data.rules) {
    const t = checkForValidators(configValidators, builtInValidators, key, data);

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
    throw new Error(`the field ${ref.outerHTML} must have a unique name attribute`);
  }
};

const isEmpty = o => {
  if (Array.isArray(o)) {
    return !o.length;
  }

  return Object.keys(o).length === 0 && o.constructor === Object;
};

const useValidator = config => {
  const elements = useRef(new Map());
  const touchedElements = useRef(new Map());
  const dirtyElements = useRef(new Map());
  const errors = useRef({});
  const customValidators = useRef(null);
  const customConfiguration = useRef({});
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

    elements.current.forEach((_value, key) => {
      fieldValidation(key);
    });
    triedToSubmit.current = true;

    if (formValidity.current !== prevFormValidity) {
      rerender({});
      return;
    }

    fn();
  };

  useEffect(() => {
    if (config === null || config === void 0 ? void 0 : config.customValidators) {
      customValidators.current = config.customValidators;
    }

    if (config === null || config === void 0 ? void 0 : config.validateFormOnSubmit) {
      customConfiguration.current.validateFormOnSubmit = true;
    }
  }, []);

  const fieldValidation = ref => {
    let _isValid = true;
    const name = hasNameAttribute(ref);
    const {
      fieldRules,
      validators
    } = elements.current.get(ref);
    const {
      rules,
      messages
    } = fieldRules;

    for (const key in validators) {
      const validator = validators[key];

      if (rules[key] && !validator(ref === null || ref === void 0 ? void 0 : ref.value)) {
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

        elements.current.set(ref, { ...elements.current.get(ref),
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
          elements.current.set(ref, { ...elements.current.get(ref),
            valid: true
          });
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
    e.stopPropagation();

    if (!dirtyElements.current.has(ref.current)) {
      dirtyElements.current.set(ref.current, null);
    }

    if (!triedToSubmit.current && customConfiguration.current.validateFormOnSubmit) return;
    fieldValidation(ref.current);
  };

  const track = (elem, rules) => {
    if (!elem) return;
    const ref = createRef();
    ref.current = elem;
    if (elements.current.has(ref.current)) return;
    ref.current && ref.current.addEventListener('focus', detectTouch(ref));
    ref.current && ref.current.addEventListener('input', detectInput(ref));
    const validators = getValidators(customValidators.current, builtInValidators, rules);
    const dataFields = {
      valid: true,
      ...(rules && {
        fieldRules: rules
      }),
      ...(validators && {
        validators
      })
    };
    elements.current.set(ref.current, dataFields);
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
