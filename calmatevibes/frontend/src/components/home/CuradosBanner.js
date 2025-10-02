import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CuradosBanner.css';

function CuradosBanner({ title, text, imageUrl }) {
  const navigate = useNavigate();

  const formatText = (text) => {
    return text.replace(/(M)(ate)/gi, '<span class="special-m">m</span><span class="special-rest">ate</span>');
  };

  const handleViewMore = () => {
    navigate('/care'); // Redirige a la página de "Cuidados"
  };

  return (
    <div className="two-column-layout">
      <div className="two-column-layout-left">
        <div className="two-column-layout-title" dangerouslySetInnerHTML={{ __html: formatText(title) }}></div>
        <div className="two-column-layout-text">{text}</div>

      </div>
      <div className="two-column-layout-right">
        <img src={imageUrl} alt="Imagen" className="two-column-layout-image" />
        <button className="two-column-layout-button" onClick={handleViewMore}>
          Ver más
        </button>
      </div>
    </div>
  );
}

export default CuradosBanner;