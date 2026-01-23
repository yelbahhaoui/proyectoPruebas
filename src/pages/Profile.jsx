import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth, storage } from '../services/firebase'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Heart, Settings, Camera, User, Edit3, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const [filter, setFilter] = useState('all');
  const [photoURL, setPhotoURL] = useState(user?.photoURL);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPhotoURL(user.photoURL);

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
    try { await logout(); navigate('/login'); } catch (error) { console.error(error); }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
        const storageRef = ref(storage, `avatars/${user.uid}`);

        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });

        setPhotoURL(downloadURL);
        
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        alert("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
        setUploading(false);
    }
  };

  const getDetailsLink = (item) => {
    switch (item.type) {
      case 'anime': return `/anime/${item.id}`;
      case 'movie': return `/movie/${item.id}`;
      case 'series': return `/series/${item.id}`;
      case 'tv':     return `/series/${item.id}`;
      case 'game':   return `/game/${item.id}`;
      default:       return `/`;
    }
  };

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(item => item.type === filter);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center dark:text-white">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          
          <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg relative ${uploading ? 'opacity-50' : ''}`}>
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User size={64} className="text-white/80" />
                    </div>
                )}
                
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={32} />
                    </div>
                )}
            </div>
            
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
            </div>
            
            <button className="absolute bottom-0 right-0 bg-slate-200 dark:bg-slate-700 p-2 rounded-full text-slate-700 dark:text-white hover:bg-blue-500 hover:text-white transition-colors shadow-md border border-white dark:border-slate-900">
                <Edit3 size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{user?.displayName || "Usuario"}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <button 
                 onClick={triggerFileSelect}
                 disabled={uploading}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors disabled:opacity-50"
               >
                 {uploading ? 'Subiendo...' : <><Settings size={16} /> Cambiar foto</>}
               </button>
               <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-colors border border-red-200 dark:border-red-500/20">
                 <LogOut size={16} /> Cerrar Sesión
               </button>
            </div>
          </div>

          <div className="flex gap-8 text-center bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
             <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">{favorites.length}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Favoritos</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'movie', 'series', 'anime', 'game'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                        filter === tab 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                >
                    {tab === 'all' ? 'Todos' : tab}
                </button>
            ))}
        </div>

        {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFavorites.map((item) => (
                <Link 
                    to={getDetailsLink(item)} 
                    key={item.id} 
                    className="group relative aspect-[2/3] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all hover:scale-[1.02] shadow-sm dark:shadow-lg"
                >
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:opacity-90 dark:group-hover:opacity-40 transition-opacity duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-1 rounded-md mb-2 inline-block shadow-sm">
                            {item.type}
                        </span>
                        <h3 className="text-white font-bold truncate text-sm md:text-base leading-tight drop-shadow-md">
                            {item.title}
                        </h3>
                    </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
                <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-500 text-lg">No tienes favoritos en esta categoría.</p>
                <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block font-bold">Explorar contenido</Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default Profile;