import { useEffect, useState } from 'react';

/** not completed */
const useKeyboard = (targetKey, cb) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    // console.log('down:', key, targetKey);
    if (targetKey === key) {
      setKeyPressed(true);
      cb();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, []);

  return keyPressed;
};

export default useKeyboard;
