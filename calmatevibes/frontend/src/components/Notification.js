import React, { useEffect } from 'react';
import './styles/Notification.css';

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Cierra la notificación automáticamente después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [onClose]);

  return (
    <div className="notification">
      <p>{message}</p>
    </div>
  );
}

export default Notification;