import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Si está cargando, mostramos un spinner o nada
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando...</div>;

  // 2. Si NO hay usuario, mostramos el mensaje de "Acceso Restringido"
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-slate-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-slate-400 mb-8">
            Para acceder al chat y a los foros, necesitas formar parte de la comunidad.
          </p>

          <Link 
            to="/login" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Iniciar Sesión
          </Link>
          
          <p className="mt-4 text-sm text-slate-500">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    );
  }

  // 3. Si hay usuario, dejamos pasar y mostramos la página solicitada
  return children;
};

export default ProtectedRoute;