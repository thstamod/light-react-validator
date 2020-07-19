import { useRef } from 'react';

const useValidator = () => {
  const elements = useRef(new Map());
  const ref = useRef(null);

  const track = (elem, rules) => {
    console.log(elem, rules);
    console.log(elements);
    ref.current = elem;
    elements.current.set(elem, {
      touched: false,
      dirty: false,
      value: null,
      valid: true,
      rules
    });

    ref.current.onchange = e => console.log('second onChange ', e.target.value);
  };

  return [track];
};

export { useValidator };
//# sourceMappingURL=index.modern.js.map
