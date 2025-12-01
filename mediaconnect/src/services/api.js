const ANILIST_API = 'https://graphql.anilist.co';

// --- CONFIGURACIÓN DE APIS ---
// 🔴 PEGA AQUÍ TUS CLAVES (Mantenlas entre comillas)
const TMDB_API_KEY = '838a2f96830809397180cc26e5480143'; 
const RAWG_API_KEY = 'fd0d765a93d6484f99da5195297889cc';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// --- ANIME (Ya lo tenías) ---
export const fetchTrendingAnime = async () => {
  const query = `
  query {
    Page(page: 1, perPage: 20) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title { romaji english }
        coverImage { large }
        averageScore
      }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error("Error anime:", error);
    return [];
  }
};

// --- PELÍCULAS (TMDB) ---
export const fetchPopularMovies = async () => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error movies:", error);
    return [];
  }
};

// --- SERIES (TMDB) ---
export const fetchPopularSeries = async () => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error series:", error);
    return [];
  }
};

// --- VIDEOJUEGOS (RAWG) ---
export const fetchPopularGames = async () => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=2023-01-01,2024-12-31&ordering=-rating&page_size=12`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error games:", error);
    return [];
  }

  
};

// Buscar Películas
export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

// Buscar Series
export const searchSeries = async (query) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

// Buscar Juegos
export const searchGames = async (query) => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${query}&page_size=12`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

// Buscar Anime
export const searchAnime = async (query) => {
  const gqlQuery = `
  query ($search: String) {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
        id
        title { romaji english }
        coverImage { large }
        averageScore
        genres
        startDate { year }
      }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query: gqlQuery, variables: { search: query } })
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) { return []; }
};

// ... (código anterior)

// --- DETALLES INDIVIDUALES ---

// 1. Detalles Película
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`);
    const data = await response.json();
    return {
      title: data.title,
      overview: data.overview,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
      date: data.release_date,
      rating: Math.round(data.vote_average * 10),
      duration: `${data.runtime} min`,
      creator: data.credits?.crew?.find(p => p.job === "Director")?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: data.status
    };
  } catch (error) { return null; }
};

// 2. Detalles Serie
export const getSeriesDetails = async (id) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`);
    const data = await response.json();
    return {
      title: data.name,
      overview: data.overview,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
      date: data.first_air_date,
      rating: Math.round(data.vote_average * 10),
      duration: `${data.number_of_seasons} Temporadas`,
      creator: data.created_by?.[0]?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: data.status
    };
  } catch (error) { return null; }
};

// 3. Detalles Juego
export const getGameDetails = async (id) => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
    const data = await response.json();
    return {
      title: data.name,
      overview: data.description_raw, // RAWG da HTML, usamos raw
      image: data.background_image,
      backdrop: data.background_image_additional,
      date: data.released,
      rating: data.metacritic,
      duration: `${data.playtime} horas`,
      creator: data.developers?.[0]?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: "Lanzado"
    };
  } catch (error) { return null; }
};

// 4. Detalles Anime
export const getAnimeDetails = async (id) => {
  const query = `
  query ($id: Int) {
    Media(id: $id) {
      title { romaji english }
      description
      coverImage { large extraLarge }
      bannerImage
      averageScore
      episodes
      status
      startDate { year month day }
      genres
      studios(isMain: true) { nodes { name } }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { id } })
    });
    const data = await response.json();
    const media = data.data.Media;
    return {
      title: media.title.english || media.title.romaji,
      overview: media.description.replace(/<[^>]*>?/gm, ''), // Limpiar HTML
      image: media.coverImage.large,
      backdrop: media.bannerImage || media.coverImage.extraLarge,
      date: `${media.startDate.year}-${media.startDate.month}-${media.startDate.day}`,
      rating: media.averageScore,
      duration: `${media.episodes || '?'} Episodios`,
      creator: media.studios?.nodes?.[0]?.name || "Studio",
      genres: media.genres?.join(", "),
      status: media.status
    };
  } catch (error) { return null; }
};