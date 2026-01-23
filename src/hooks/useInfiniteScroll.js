import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback, isLoading) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          callback();
        }
      },
      { threshold: 1.0 } 
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, isLoading, callback]);

  return observerTarget;
};