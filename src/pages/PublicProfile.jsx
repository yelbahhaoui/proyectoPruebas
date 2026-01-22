import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../services/notificationService'; // Importamos el servicio
import { User, Heart, UserPlus, UserCheck, MessageCircle } from 'lucide-react';

const PublicProfile = () => {
  const { uid } = useParams(); // ID del usuario que visitamos
  const { user } = useAuth(); // Yo (el que visita)
  
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos del usuario y sus favoritos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos del usuario
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
          
          // Sus Favoritos
          const favsSnapshot = await getDocs(collection(db, "users", uid, "favorites"));
          setFavorites(favsSnapshot.docs.map(d => d.data()));

          // Comprobar si ya le sigo
          if (user) {
            const followDoc = await getDoc(doc(db, "users", user.uid, "following", uid));
            setIsFollowing(followDoc.exists());
          }
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid, user]);

  // 2. Manejar Seguir / Dejar de seguir
  const handleFollow = async () => {
    if (!user) return alert("Inicia sesión para seguir a usuarios");

    const myFollowingRef = doc(db, "users", user.uid, "following", uid);
    const theirFollowersRef = doc(db, "users", uid, "followers", user.uid);

    try {
      if (isFollowing) {
        // Dejar de seguir
        await deleteDoc(myFollowingRef);
        await deleteDoc(theirFollowersRef);
        setIsFollowing(false);
      } else {
        // Seguir
        await setDoc(myFollowingRef, { since: new Date() });
        await setDoc(theirFollowersRef, { since: new Date() });
        setIsFollowing(true);

        // --- NOTIFICAR AL USUARIO ---
        await sendNotification(
            uid, 
            'follow', 
            user, 
            'te ha comenzado a seguir.', 
            `/user/${user.uid}`
        );
      }
    } catch (error) {
      console.error("Error al seguir:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center dark:text-white">Cargando...</div>;
  if (!profile) return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center dark:text-white">Usuario no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* CABECERA PERFIL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl border border-slate-200 dark:border-slate-800">
           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                {profile.photoURL ? <img src={profile.photoURL} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white"><User size={60}/></div>}
           </div>
           
           <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{profile.displayName}</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-4">@{profile.displayName?.toLowerCase().replace(/\s/g, '')}</p>
                
                {user?.uid !== uid && (
                    <div className="flex justify-center md:justify-start gap-3">
                        <button 
                            onClick={handleFollow}
                            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                                isFollowing 
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                            }`}
                        >
                            {isFollowing ? <><UserCheck size={18}/> Siguiendo</> : <><UserPlus size={18}/> Seguir</>}
                        </button>
                        
                        {/* Botón para ir al chat con este usuario */}
                        <Link 
                            to={`/chat?chatId=new&uid=${uid}`} // (Nota: Habría que ajustar Chat.jsx para recibir esto, por ahora link simple)
                            className="px-6 py-2 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                            <MessageCircle size={18}/> Mensaje
                        </Link>
                    </div>
                )}
           </div>

           <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center min-w-[100px]">
                <span className="block text-2xl font-bold text-blue-600">{favorites.length}</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Favoritos</span>
           </div>
        </div>

        {/* LISTA DE FAVORITOS (Reutilizando diseño) */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="text-red-500" fill="currentColor"/> Favoritos de {profile.displayName}
        </h3>

        {favorites.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map((item, index) => (
                    <Link to={`/${item.type === 'tv' ? 'series' : item.type}/${item.id}`} key={index} className="group relative aspect-[2/3] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden shadow-md">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:opacity-60 transition-all"/>
                        <div className="absolute bottom-0 p-3 w-full bg-gradient-to-t from-black/80 to-transparent">
                             <p className="text-white text-sm font-bold truncate">{item.title}</p>
                             <span className="text-[10px] text-blue-300 uppercase">{item.type}</span>
                        </div>
                    </Link>
                ))}
             </div>
        ) : (
            <p className="text-slate-500 text-center py-10 bg-slate-100 dark:bg-slate-900 rounded-xl">Este usuario aún no tiene favoritos.</p>
        )}

      </div>
    </div>
  );
};

export default PublicProfile;