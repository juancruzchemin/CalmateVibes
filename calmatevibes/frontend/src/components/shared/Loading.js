import React from 'react';
import './Loading.css';

function Loading({ text = 'Cargando...', fullPage = false }) {
    if (fullPage) {
        return (
            <div className="loading-fullpage">
                <div className="loading-spinner"></div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        );
    }

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}

export default Loading;
