import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Heart, Settings, Camera, User } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'series', 'anime', 'game'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favsData = querySnapshot.docs.map(doc => doc.data());
        setFavorites(favsData);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  // --- LÓGICA CORREGIDA PARA LAS RUTAS ---
  const getDetailsLink = (item) => {
    // Dependiendo del 'type' guardado, devolvemos la ruta correcta
    switch (item.type) {
      case 'anime': return `/anime/${item.id}`;
      case 'movie': return `/movie/${item.id}`;
      case 'series': return `/series/${item.id}`;
      case 'tv':     return `/series/${item.id}`; // Por si acaso se guardó como 'tv'
      case 'game':   return `/game/${item.id}`;
      default:       return `/`; // Fallback
    }
  };

  // Filtrar favoritos según la pestaña
  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(item => item.type === filter);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER PERFIL */}
        <div className="bg-slate-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-800 shadow-xl">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-lg">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <User size={64} className="text-white/50" />
                    </div>
                )}
            </div>
            <button className="absolute bottom-0 right-0 bg-slate-700 p-2 rounded-full text-white hover:bg-blue-600 transition-colors shadow-md border border-slate-900">
                <Camera size={18} />
            </button>
          </div>

          {/* Info Usuario */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-1">{user?.displayName || "Usuario"}</h1>
            <p className="text-slate-400 mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-bold transition-colors">
                 <Settings size={16} /> Editar foto de perfil
               </button>
               <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-bold transition-colors border border-red-500/20">
                 <LogOut size={16} /> Cerrar Sesión
               </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 text-center bg-slate-950/50 p-6 rounded-xl border border-slate-800">
             <div>
                <p className="text-3xl font-bold text-blue-500">{favorites.length}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Favoritos</p>
             </div>
          </div>
        </div>

        {/* TABS FILTROS */}
        <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'movie', 'series', 'anime', 'game'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                        filter === tab 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    {tab === 'all' ? 'Todos' : tab}
                </button>
            ))}
        </div>

        {/* GRID FAVORITOS */}
        {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFavorites.map((item) => (
                // AQUÍ USAMOS LA FUNCIÓN getDetailsLink
                <Link 
                    to={getDetailsLink(item)} 
                    key={item.id} 
                    className="group relative aspect-[2/3] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all hover:scale-[1.02] shadow-lg"
                >
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        {/* Etiqueta Tipo */}
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md mb-2 inline-block border border-blue-500/20">
                            {item.type}
                        </span>
                        <h3 className="text-white font-bold truncate text-sm md:text-base leading-tight">
                            {item.title}
                        </h3>
                        {item.rating && (
                            <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                                <Heart size={12} fill="currentColor" /> {item.rating}%
                            </div>
                        )}
                    </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <Heart size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 text-lg">No tienes favoritos en esta categoría.</p>
                <Link to="/" className="text-blue-400 hover:underline mt-2 inline-block">Explorar contenido</Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default Profile;