import { useRef, useState, useEffect, createRef } from 'react';

var builtInValidators = {
  require: input => input.trim().length > 0,
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
  const name = ref.current.name;

  if (name) {
    return name;
  } else {
    var _ref$current;

    throw new Error(`the field ${(_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.outerHTML} must have a unique name attribute`);
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
  const [, rerender] = useState();

  const submitForm = fn => e => {
    e.preventDefault();
    console.log('validator formSubmit');

    for (const el in elements.current) {
      fieldValidation(elements.current[el]);
    }

    fn();
  };

  useEffect(() => {
    if (config === null || config === void 0 ? void 0 : config.customValidators) {
      customValidators.current = config.customValidators;
    }
  }, []);

  const fieldValidation = ref => {
    const prev = elements.current.get(ref.current);
    let _isValid = true;
    const {
      fieldRules,
      validators
    } = elements.current.get(ref.current);
    const {
      rules,
      messages
    } = fieldRules;

    for (const key in validators) {
      var _ref$current;

      const validator = validators[key];
      const name = hasNameAttribute(ref);

      if (rules[key] && !validator(ref === null || ref === void 0 ? void 0 : (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.value)) {
        errors.current[name] = {
          [key]: messages === null || messages === void 0 ? void 0 : messages[key],
          ...errors.current[name]
        };
        elements.current.set(ref.current, { ...prev,
          valid: false
        });
        _isValid = false;
      } else {
        var _errors$current, _errors$current$name, _errors$current2, _errors$current3;

        (_errors$current = errors.current) === null || _errors$current === void 0 ? true : (_errors$current$name = _errors$current[name]) === null || _errors$current$name === void 0 ? true : delete _errors$current$name[key];
        isEmpty((_errors$current2 = errors.current) === null || _errors$current2 === void 0 ? void 0 : _errors$current2[name]) && ((_errors$current3 = errors.current) === null || _errors$current3 === void 0 ? true : delete _errors$current3[name]);
        errors.current = { ...errors.current
        };
        elements.current.set(ref.current, { ...prev,
          valid: true
        });
        _isValid = true;
      }
    }

    console.log(_isValid);

    if (prev !== elements.current.get(ref.current)) {
      rerender({});
    }
  };

  const detectInput = ref => e => {
    e.stopPropagation();

    if (!dirtyElements.current.has(ref)) {
      dirtyElements.current.set(ref, null);
      return;
    }

    fieldValidation(ref);
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
    console.log(elements);
    elements.current.set(ref.current, dataFields);
  };

  const detectTouch = ref => () => {
    touchedElements.current.set(ref, null);
    ref.current && ref.current.removeEventListener('focus', detectTouch(ref), true);
  };

  return {
    track: track,
    submitForm: submitForm,
    errors: errors.current
  };
};

export { useValidator };
//# sourceMappingURL=index.modern.js.map
