import React from 'react';
import '../styles/SectionDividerImage.css';

function SectionDividerImage({ src, alt = '', height = '120px', speed = 200 }) {
  // Crear múltiples copias para el efecto infinito sin espacios
  const images = Array(15).fill(null).map((_, index) => (
    <img 
      key={index} 
      src={src} 
      alt={`${alt} ${index + 1}`} 
      className="section-divider-image"
      draggable="false"
    />
  ));

  return (
    <div className="section-divider-container" style={{ height }}>
      <div 
        className="section-divider-wrapper" 
        style={{ animationDuration: `${speed}s` }}
      >
        {images}
        {/* Duplicar las imágenes para efecto seamless */}
        {images}
      </div>
    </div>
  );
}

export default SectionDividerImage;