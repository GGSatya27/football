import { useEffect, useRef, useState } from 'react';

/** Count-up number animation */
export function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    start.current = 0;
    const animate = (t: number) => {
      if (!start.current) start.current = t;
      const progress = Math.min((t - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
