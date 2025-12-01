import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import MediaCard from '../components/media/MediaCard';
import { Filter, Settings, User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all'); // all, movie, series, anime, game
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
        const favsData = querySnapshot.docs.map(doc => doc.data());
        setFavorites(favsData);
      } catch (error) {
        console.error("Error fetching favs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  // Lógica de filtrado
  const filteredFavs = filter === 'all' 
    ? favorites 
    : favorites.filter(item => {
        // Normalizamos los tipos para que coincidan (ej: 'Serie TV' -> 'series')
        const type = item.type?.toLowerCase();
        if (filter === 'movie') return type?.includes('película') || type === 'movie';
        if (filter === 'series') return type?.includes('serie') || type === 'tv';
        if (filter === 'game') return type?.includes('juego') || type === 'game';
        if (filter === 'anime') return type?.includes('anime');
        return true;
    });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8">
        
        {/* Cabecera del Perfil */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl text-white font-bold border-4 border-white dark:border-slate-800 shadow-xl">
             {user?.displayName ? user.displayName[0].toUpperCase() : <User />}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user?.displayName || "Usuario"}</h1>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            <div className="flex gap-2 mt-4 justify-center md:justify-start">
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                 <Settings size={18} /> Editar Perfil
               </button>
            </div>
          </div>
          <div className="ml-auto text-center md:text-right">
            <div className="text-4xl font-bold text-blue-600">{favorites.length}</div>
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Favoritos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'movie', 'series', 'anime', 'game'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-bold capitalize transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>

        {/* Grid de Favoritos */}
        {loading ? (
           <p className="text-center py-10">Cargando biblioteca...</p>
        ) : filteredFavs.length === 0 ? (
           <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <Filter size={48} className="mx-auto mb-4 opacity-50" />
             <p>No tienes favoritos en esta categoría.</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredFavs.map((item) => (
              <MediaCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;