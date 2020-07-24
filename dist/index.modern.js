import { useRef, useState, useEffect, createRef } from 'react';

var builtInValidators = {
  require: input => input.trim().length > 0,
  email: input => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input, len) => input.toString().length < len
};

const useValidator = config => {
  console.log('rerender useValidator');
  const elements = useRef(new Map());
  const touchedElements = useRef(new Map());
  const dirtyElements = useRef(new Map());
  const errors = useRef({});
  const customValidators = useRef(null);
  const [validity, setValidity] = useState(true);

  const submitForm = fn => e => {
    e.preventDefault();
    console.log('validator formSubmit');

    for (const el of elements) {
      fieldValidation(el);
    }

    fn();
  };

  useEffect(() => {
    if (config.customValidators) {
      customValidators.current = config.customValidators;
    }
  }, []);

  const fieldValidation = ref => {
    let _isValid = true;
    const {
      data
    } = elements.current.get(ref.current);
    const validators = getValidators(data, customValidators.current, builtInValidators);
    const {
      rules,
      msgs
    } = data;

    for (const key in validators) {
      const validator = validators[key];
      const name = ref.current.name;

      if (rules[key] && !validator(ref.current.value)) {
        errors.current[name] = {
          [key]: msgs === null || msgs === void 0 ? void 0 : msgs[key],
          ...errors.current[name]
        };
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

  const keyup = ref => e => {
    console.log(e);

    if (!dirtyElements.current.has(ref)) {
      dirtyElements.current.set(ref);
      return;
    }

    console.log(e);
    const v = fieldValidation(ref);

    if (validity !== v) {
      setValidity(v => !v);
    }
  };

  const getValidators = (data, configValidators, builtInValidators) => {
    if (!data) return;
    const f = {};

    for (const key in data === null || data === void 0 ? void 0 : data.rules) {
      console.log(key);
      const t = checkForValidators(data, configValidators, builtInValidators, key);
      console.log(t);

      if (t) {
        f[key] = t;
      }
    }

    return f;
  };

  const checkForValidators = (data, configValidators, builtInValidators, name) => {
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
      throw new Error(`no validation function with mane ${name}`);
    }
  };

  const track = (elem, rules) => {
    if (!elem) return;
    const ref = createRef();
    if (elements.current.has(ref)) return;
    ref.current = elem;
    elements.current.set(elem, {
      valid: true,
      ...(rules && {
        data: rules
      })
    });
    ref.current.addEventListener('focus', partialOnFocus(ref));
    ref.current.addEventListener('input', keyup(ref));
  };

  const partialOnFocus = ref => e => {
    console.log('partial focus');
    touchedElements.current.set(ref);
    ref.current.onfocus = '';
  };

  return [track, submitForm, errors.current];
};

export { useValidator };
//# sourceMappingURL=index.modern.js.map
