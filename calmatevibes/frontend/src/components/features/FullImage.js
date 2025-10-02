import React from 'react';
import '../styles/FullImage.css';

function FullImage({ src, alt = '', background }) {
  return (
    <div className="full-image-container" style={{ backgroundColor: background }}>
      <img src={src} alt={alt} className="full-image" />
    </div>
  );
}

export default FullImage;