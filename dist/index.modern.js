import { useState, useRef, useEffect } from 'react';

const useValidator = () => {
  const [state, setstate] = useState(null);
  const ref = useRef(null);

  const track = (elem, rules) => {
    ref.current = elem;
    setstate(ref);
  };

  useEffect(() => {
    ref.current.onkeydown = e => console.log(e.target.value);
  }, [state]);
  return [track];
};

export { useValidator };
//# sourceMappingURL=index.modern.js.map
