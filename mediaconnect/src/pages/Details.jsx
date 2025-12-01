import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, User, Tag } from 'lucide-react';
import { getMovieDetails, getSeriesDetails, getGameDetails, getAnimeDetails } from '../services/api';

const Details = ({ type }) => {
  const { id } = useParams(); // Obtenemos el ID de la URL (ej: 123)
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let data = null;

      // Elegimos qué función llamar según el tipo
      if (type === 'movie') data = await getMovieDetails(id);
      else if (type === 'series') data = await getSeriesDetails(id);
      else if (type === 'game') data = await getGameDetails(id);
      else if (type === 'anime') data = await getAnimeDetails(id);

      setItem(data);
      setLoading(false);
    };
    loadData();
  }, [id, type]);

  if (loading) return <div className="text-white text-center py-20">Cargando información...</div>;
  if (!item) return <div className="text-white text-center py-20">No se encontraron detalles 😔</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* 1. HERO BACKDROP (Imagen de fondo grande) */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
        <img src={item.backdrop || item.image} alt="Fondo" className="w-full h-full object-cover opacity-50" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 bg-slate-800/80 p-2 rounded-full hover:bg-blue-600 transition-colors text-white"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* POSTER */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-64 h-96 object-cover rounded-xl shadow-2xl border-4 border-slate-900"
            />
          </div>

          {/* INFORMACIÓN */}
          <div className="flex-1 pt-4 md:pt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{item.title}</h1>
            
            {/* Etiquetas Rápidas */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-600/30">
                {type.toUpperCase()}
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> {item.rating || '?'}%
              </span>
               <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                {item.status}
              </span>
            </div>

            {/* Grid de Metadatos */}
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
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><User size={12}/> CREADOR/STUDIO</p>
                <p className="text-white font-medium truncate" title={item.creator}>{item.creator}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Tag size={12}/> GÉNEROS</p>
                <p className="text-white font-medium truncate" title={item.genres}>{item.genres}</p>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-3">Sinopsis</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {item.overview || "No hay descripción disponible actualmente para este título."}
              </p>
            </div>
            
            {/* Botones de Acción (Mockup) */}
            <div className="mt-8 flex gap-4">
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105">
                 Añadir a Favoritos
               </button>
               <button className="border border-slate-600 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold">
                 Ver Trailer
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;