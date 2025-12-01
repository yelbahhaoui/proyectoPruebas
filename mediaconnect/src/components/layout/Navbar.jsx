import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Hook para saber en qué ruta estamos

  // Función para asignar estilos: si la ruta coincide, se pone azul y negrita
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "text-blue-500 font-bold" 
      : "text-slate-300 hover:text-white transition-colors";
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              MediaConnect
            </span>
          </Link>

          {/* MENÚ ESCRITORIO */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/movies" className={getLinkClass('/movies')}>Películas</Link>
            <Link to="/series" className={getLinkClass('/series')}>Series</Link>
            <Link to="/anime" className={getLinkClass('/anime')}>Anime</Link>
            <Link to="/games" className={getLinkClass('/games')}>Juegos</Link>
            
            {/* Nuevo enlace a Foros */}
            <Link to="/forum" className={`flex items-center gap-1 ${getLinkClass('/forum')}`}>
              <MessageSquare size={16} /> Foros
            </Link>
          </div>

          {/* BOTÓN LOGIN (Derecha) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-blue-500/20">
              <LogIn size={18} /> Acceder
            </Link>
          </div>
          
          {/* BOTÓN MENÚ MÓVIL (Hamburguesa) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link 
               to="/movies" 
               onClick={() => setIsOpen(false)} 
               className={`block px-3 py-2 rounded-md text-base ${getLinkClass('/movies')}`}
             >
               Películas
             </Link>
             <Link 
               to="/series" 
               onClick={() => setIsOpen(false)} 
               className={`block px-3 py-2 rounded-md text-base ${getLinkClass('/series')}`}
             >
               Series
             </Link>
             <Link 
               to="/anime" 
               onClick={() => setIsOpen(false)} 
               className={`block px-3 py-2 rounded-md text-base ${getLinkClass('/anime')}`}
             >
               Anime
             </Link>
             <Link 
               to="/games" 
               onClick={() => setIsOpen(false)} 
               className={`block px-3 py-2 rounded-md text-base ${getLinkClass('/games')}`}
             >
               Juegos
             </Link>
             <Link 
               to="/forum" 
               onClick={() => setIsOpen(false)} 
               className={`block px-3 py-2 rounded-md text-base ${getLinkClass('/forum')}`}
             >
               Foros
             </Link>
             
             <div className="pt-4 mt-4 border-t border-slate-800">
               <Link 
                 to="/register"
                 onClick={() => setIsOpen(false)}
                 className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-md font-bold"
               >
                 Iniciar Sesión
               </Link>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;