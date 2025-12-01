import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, User, Tag, Heart } from 'lucide-react';
import { getMovieDetails, getSeriesDetails, getGameDetails, getAnimeDetails, addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Details = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [error, setError] = useState(false); // Nuevo estado de error

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        console.log(`Cargando ${type} con ID: ${id}`); // Log para depurar
        let data = null;

        if (type === 'movie') data = await getMovieDetails(id);
        else if (type === 'series') data = await getSeriesDetails(id);
        else if (type === 'game') data = await getGameDetails(id);
        else if (type === 'anime') data = await getAnimeDetails(id);

        if (data) {
          setItem(data);
          // Comprobar favorito solo si hay datos y usuario
          if (user) {
            const exists = await checkIsFavorite(user.uid, id);
            setIsFav(exists);
          }
        } else {
          setError(true); // Si data es null, es un error
        }
      } catch (err) {
        console.error("Error cargando detalles:", err);
        setError(true);
      } finally {
        setLoading(false); // Se ejecuta SIEMPRE, evita el bucle infinito
      }
    };
    loadData();
  }, [id, type, user]);

  const handleToggleFavorite = async () => {
    if (!user) return alert("Inicia sesión para añadir a favoritos");
    const itemToSave = { ...item, id, type };
    if (isFav) {
      await removeFromFavorites(user.uid, id);
      setIsFav(false);
    } else {
      await addToFavorites(user.uid, itemToSave);
      setIsFav(true);
    }
  };

  if (loading) return <div className="text-white text-center py-20 text-xl">Cargando información...</div>;
  
  // Mensaje de error amigable
  if (error || !item) return (
    <div className="text-white text-center py-20">
      <h2 className="text-2xl font-bold text-red-400 mb-4">¡Vaya! Algo salió mal.</h2>
      <p className="text-slate-400 mb-6">No pudimos encontrar los detalles de este contenido.</p>
      <button onClick={() => navigate(-1)} className="bg-slate-800 px-6 py-2 rounded-lg hover:bg-slate-700">Volver atrás</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* HERO BACKDROP */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
        <img src={item.backdrop || item.image} alt="Fondo" className="w-full h-full object-cover opacity-50" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-20 bg-slate-800/80 p-2 rounded-full hover:bg-blue-600 transition-colors text-white">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* POSTER */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img src={item.image} alt={item.title} className="w-64 h-96 object-cover rounded-xl shadow-2xl border-4 border-slate-900" />
          </div>

          {/* INFORMACIÓN */}
          <div className="flex-1 pt-4 md:pt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-600/30">{type.toUpperCase()}</span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> {item.rating || '?'}%
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">{item.status}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> ESTRENO</p>
                <p className="text-white font-medium">{item.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Clock size={12}/> DURACIÓN</p>
                <p className="text-white font-medium">{item.duration}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><User size={12}/> CREADOR</p>
                <p className="text-white font-medium truncate" title={item.creator}>{item.creator}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Tag size={12}/> GÉNEROS</p>
                <p className="text-white font-medium truncate" title={item.genres}>{item.genres}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-3">Sinopsis</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{item.overview || "No hay descripción disponible."}</p>
            </div>
            
            <div className="mt-8 flex gap-4">
               <button 
                onClick={handleToggleFavorite}
                className={`px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105 flex items-center gap-2 ${
                  isFav ? 'bg-pink-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Heart fill={isFav ? "currentColor" : "none"} />
                {isFav ? "En Favoritos" : "Añadir a Favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;