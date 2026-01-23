import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <--- 1. IMPORTANTE
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // <--- 2. DETECTAR RUTA
  const [isVisible, setIsVisible] = useState(false);

  // --- LÓGICA 1: RESTAURAR SCROLL AL CAMBIAR DE PÁGINA ---
  useEffect(() => {
    // Al cambiar la ruta (pathname), subimos arriba del todo instantáneamente
    window.scrollTo(0, 0);
  }, [pathname]);


  // --- LÓGICA 2: BOTÓN FLOTANTE (Mostrar/Ocultar) ---
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Función para subir suavemente (al hacer clic en el botón)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Volver arriba"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;