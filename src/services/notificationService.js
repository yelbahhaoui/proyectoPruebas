import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

// 1. Notificar a una persona específica (Ej: Alguien te siguió)
export const sendNotification = async (targetUserId, type, senderUser, message = "", link = "") => {
  if (!targetUserId || targetUserId === senderUser.uid) return; // No notificarse a sí mismo

  try {
    await addDoc(collection(db, "users", targetUserId, "notifications"), {
      type, // 'follow', 'like', 'comment', 'post'
      senderId: senderUser.uid,
      senderName: senderUser.displayName || "Usuario",
      senderAvatar: senderUser.photoURL || null,
      message,
      link,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
};

// 2. Notificar a TODOS tus seguidores (Ej: Publicaste algo nuevo)
export const notifyFollowers = async (currentUserId, currentUserData, type, message, link) => {
  try {
    // Buscar quién me sigue
    const followersRef = collection(db, "users", currentUserId, "followers");
    const snapshot = await getDocs(followersRef);

    // Enviar notificación a cada uno (En una app real esto se hace en el Backend/Cloud Functions, pero aquí lo haremos en cliente)
    const promises = snapshot.docs.map(doc => {
      const followerId = doc.id;
      return sendNotification(followerId, type, currentUserData, message, link);
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error notificando seguidores:", error);
  }
};