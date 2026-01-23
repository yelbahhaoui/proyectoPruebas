import React, { useEffect, useState } from 'react';
import { fetchPopularGames, searchGames } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'; 

const Games = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1);

  const genres = [
    { id: "action", name: "Acción" }, { id: "adventure", name: "Aventura" },
    { id: "role-playing-games-rpg", name: "RPG" }, { id: "shooter", name: "Shooter" },
    { id: "indie", name: "Indie" }, { id: "strategy", name: "Estrategia" },
    { id: "sports", name: "Deportes" }, { id: "racing", name: "Carreras" }
  ];

  const lastElementRef = useInfiniteScroll(() => {
    setPage(prev => prev + 1);
  }, loading);

  useEffect(() => { loadContent(page); }, [page]);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      result = result.filter(g => g.genres && g.genres.some(gen => gen.slug === filters.genre));
    }
    if (filters.year) {
      result = result.filter(g => g.released && g.released.startsWith(filters.year));
    }
    if (filters.minRating > 0) {
      result = result.filter(g => (g.metacritic || 0) >= filters.minRating * 10);
    }
    setDisplayedGames(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum) => {
    setLoading(true);
    
    if (pageNum > 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    const data = await fetchPopularGames(pageNum);
    
    if (pageNum === 1) {
      setRawData(data || []);
    } else {
      setRawData(prev => [...prev, ...(data || [])]);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { setPage(1); loadContent(1); return; }
    const data = await searchGames(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-green-500 pl-4">Videojuegos</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedGames.map((game, index) => (
          <MediaCard 
            key={`${game.id}-${index}`}
            id={game.id}
            title={game.name}
            image={game.background_image}
            rating={game.metacritic || 0}
            type="Juego"
          />
        ))}
      </div>

      <div ref={lastElementRef} className="h-24 flex items-center justify-center mt-8">
          {loading && (
             <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-bold">Cargando más juegos...</span>
             </div>
          )}
      </div>
    </div>
  );
};

export default Games;