import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, MessageSquare, LogOut, User, Settings, Heart, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Importamos el tema

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Menú móvil
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Menú usuario
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Cerrar dropdown si hago click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "text-blue-600 dark:text-blue-500 font-bold" 
      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors";
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MediaConnect
          </Link>

          {/* Menú Escritorio */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/movies" className={getLinkClass('/movies')}>Películas</Link>
            <Link to="/series" className={getLinkClass('/series')}>Series</Link>
            <Link to="/anime" className={getLinkClass('/anime')}>Anime</Link>
            <Link to="/games" className={getLinkClass('/games')}>Juegos</Link>
            <Link to="/forum" className={`flex items-center gap-1 ${getLinkClass('/forum')}`}>
              <MessageSquare size={16} /> Foros
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Toggle Tema */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Usuario Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                >
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.displayName ? user.displayName[0].toUpperCase() : <User size={16}/>}
                   </div>
                   <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {user.displayName || "Usuario"}
                   </span>
                   <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                </button>

                {/* El Menú Desplegable */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-900 dark:text-white font-bold truncate">{user.displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Heart size={16} className="text-red-500" /> Favoritos
                    </Link>
                    
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Settings size={16} className="text-blue-500" /> Configuración
                    </Link>
                    
                    <div className="border-t border-slate-200 dark:border-slate-800 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105">
                <LogIn size={18} /> Acceder
              </Link>
            )}
          </div>

          {/* Botón Móvil */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú Móvil (Simplificado) */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
             <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Mi Perfil / Favoritos</Link>
             {/* ... otros links ... */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;