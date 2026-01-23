// src/hooks/useInfiniteScroll.js
import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback, isLoading) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Si el elemento es visible Y no estamos cargando datos actualmente
        if (entries[0].isIntersecting && !isLoading) {
          callback();
        }
      },
      { threshold: 1.0 } // 1.0 significa que el elemento debe verse completo
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