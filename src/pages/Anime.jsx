import React, { useEffect, useState } from 'react';
import { fetchTrendingAnime, searchAnime } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'; // <--- IMPORTADO

const Anime = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedAnime, setDisplayedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mecha", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports"
  ].map(g => ({ id: g, name: g }));

  // Hook Scroll
  const lastElementRef = useInfiniteScroll(() => {
    setPage(prev => prev + 1);
  }, loading);

  useEffect(() => { loadContent(page); }, [page]);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      result = result.filter(a => a.genres && a.genres.includes(filters.genre));
    }
    if (filters.year) {
      result = result.filter(a => a.startDate && a.startDate.year == filters.year);
    }
    if (filters.minRating > 0) {
      result = result.filter(a => (a.averageScore || 0) >= filters.minRating * 10);
    }
    setDisplayedAnime(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum) => {
    setLoading(true);
    
    // --- DELAY ARTIFICIAL ---
    if (pageNum > 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    // ------------------------

    const data = await fetchTrendingAnime(pageNum);
    
    if (pageNum === 1) {
      setRawData(data || []);
    } else {
      setRawData(prev => [...prev, ...(data || [])]);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { setPage(1); loadContent(1); return; }
    const data = await searchAnime(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">Anime</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedAnime.map((anime, index) => (
          <MediaCard 
            key={`${anime.id}-${index}`}
            id={anime.id}
            title={anime.title.english || anime.title.romaji}
            image={anime.coverImage.large}
            rating={anime.averageScore}
            type="Anime"
          />
        ))}
      </div>

      {/* ELEMENTO CENTINELA */}
      <div ref={lastElementRef} className="h-24 flex items-center justify-center mt-8">
          {loading && (
             <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-bold">Cargando más anime...</span>
             </div>
          )}
      </div>
    </div>
  );
};

export default Anime;