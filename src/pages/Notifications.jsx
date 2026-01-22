import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Bell, Heart, UserPlus, MessageSquare, FileText } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Escuchar notificaciones en tiempo real
    const q = query(
        collection(db, "users", user.uid, "notifications"), 
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = async (notif) => {
    // Marcar como leída
    if (!notif.read) {
        await updateDoc(doc(db, "users", user.uid, "notifications", notif.id), { read: true });
    }
    // Navegar
    if (notif.link) navigate(notif.link);
  };

  const getIcon = (type) => {
    switch (type) {
        case 'like': return <Heart className="text-red-500" size={20} fill="currentColor"/>;
        case 'follow': return <UserPlus className="text-blue-500" size={20} />;
        case 'comment': return <MessageSquare className="text-green-500" size={20} />;
        case 'post': return <FileText className="text-purple-500" size={20} />;
        default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell /> Notificaciones
            </h1>
            {notifications.some(n => !n.read) && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length} nuevas
                </span>
            )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                        {/* Avatar Emisor */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                {notif.senderAvatar && <img src={notif.senderAvatar} alt="" className="w-full h-full object-cover"/>}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                                {getIcon(notif.type)}
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-slate-800 dark:text-slate-200">
                                <span className="font-bold text-slate-900 dark:text-white">{notif.senderName}</span> {notif.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {notif.createdAt?.seconds ? new Date(notif.createdAt.seconds * 1000).toLocaleDateString() : 'Justo ahora'}
                            </p>
                        </div>

                        {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-slate-500">
                    No tienes notificaciones.
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;