import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, searchMovies } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';

const Movies = () => {
  // Estado para los datos crudos (lo que devuelve la API)
  const [rawData, setRawData] = useState([]);
  // Estado para los datos filtrados (lo que ve el usuario)
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de los filtros
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: 0
  });

  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  // Lista manual de géneros de TMDB para el select (para simplificar)
  const genres = [
    { id: 28, name: "Acción" }, { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" }, { id: 878, name: "Ciencia Ficción" }
  ];

  // 1. CARGA INICIAL
  useEffect(() => {
    loadContent();
  }, []);

  // 2. EFECTO DE FILTRADO LOCAL
  // Cada vez que cambien los filtros o la data cruda, ejecutamos el filtro
  useEffect(() => {
    let result = rawData;

    // Filtro por Género (si hay uno seleccionado)
    if (filters.genre) {
      const genreId = parseInt(filters.genre);
      result = result.filter(m => m.genre_ids && m.genre_ids.includes(genreId));
    }

    // Filtro por Año
    if (filters.year) {
      result = result.filter(m => m.release_date && m.release_date.startsWith(filters.year));
    }

    // Filtro por Rating (convertimos 0-10 a la escala que sea necesaria)
    if (filters.minRating > 0) {
      result = result.filter(m => m.vote_average >= filters.minRating);
    }

    setDisplayedMovies(result);
  }, [rawData, filters]);

  // Función para cargar populares
  const loadContent = async () => {
    setLoading(true);
    const data = await fetchPopularMovies();
    setRawData(data || []);
    setLoading(false);
  };

  // Función para manejar la búsqueda (API)
  const handleSearch = async (query) => {
    if (!query) {
      loadContent(); // Si borra, volvemos a populares
      return;
    }
    // Debounce simple: esperar a que termine de escribir podría hacerse aquí,
    // pero para PMV lo hacemos directo.
    const data = await searchMovies(query);
    setRawData(data || []);
  };

  // Manejador de cambios en los inputs de filtro
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ genre: '', year: '', minRating: 0 });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
        Películas
      </h1>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <FilterBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        genresList={genres}
      />

      {loading ? (
        <div className="text-white text-center py-20 animate-pulse">Cargando cartelera...</div>
      ) : (
        <>
          <div className="text-slate-400 mb-4 text-sm">
            Mostrando {displayedMovies.length} resultados
          </div>
          
          {displayedMovies.length === 0 ? (
             <div className="text-center py-10 text-slate-500">
               No se encontraron películas con esos filtros 😔
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {displayedMovies.map((movie) => (
                <MediaCard 
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
                  rating={Math.round(movie.vote_average * 10)}
                  type="Película"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;