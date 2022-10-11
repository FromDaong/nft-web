import { useEffect, useRef } from 'react';

const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>();

  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback]
  );

  useEffect(
    () => {
      //@ts-ignore
      const handler = (...args) => savedCallback.current(...args);

      if (delay !== null) {
        const id = setInterval(handler, delay);
        return () => clearInterval(id);
      }
    },
    [delay]
  );
};

export default useInterval;