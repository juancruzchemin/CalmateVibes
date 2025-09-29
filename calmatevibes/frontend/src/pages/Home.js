import React, { useEffect, useRef, useState } from 'react';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Content from '../components/Content.js';
import Tienda from '../components/Tienda.js';
import InstagramFeed from '../components/InstagramFeed.js';
import FullImage from '../components/FullImage.js';
import SectionDividerImage from '../components/SectionDividerImage.js';
import CuradosBanner from '../components/CuradosBanner.js';

import './styles/Home.css';

function Home() {
  const sectionRefs = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detectar preferencia de motion reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Preload de imágenes críticas
    const criticalImages = ['/javi-mate.jpeg', '/divisor-beige.jpg'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [src]: true }));
      };
    });
  }, []);

  useEffect(() => {
    // Sistema personalizado de animación en scroll con delays escalonados
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Animación escalonada solo si no prefiere motion reducido
          const delay = prefersReducedMotion ? 0 : index * 150;
          
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, delay);
        }
      });
    }, observerOptions);

    // Observar todas las secciones
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [prefersReducedMotion]);

  // Componente de imagen con lazy loading y parallax
  const LazyImage = ({ src, alt, className, parallax = false }) => {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
      if (parallax && imgRef.current && !prefersReducedMotion) {
        const handleScroll = () => {
          const rect = imgRef.current.getBoundingClientRect();
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          imgRef.current.style.transform = `translateY(${rate}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }
    }, [parallax, prefersReducedMotion]);

    return (
      <div className={`lazy-image-container ${className || ''}`}>
        {!loaded && <div className="image-placeholder">Cargando...</div>}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ 
            opacity: loaded ? 1 : 0,
            transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-in-out'
          }}
        />
      </div>
    );
  };

  return (
    <div className="home-page">
      <Header />
      <div className="home-container">
        <div className="home-inner-container">
          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[0] = el}
            style={{ animationDelay: '0ms' }}
          >
            <div className="hero-section">
              <FullImage src="/javi-mate.jpeg" alt="Javi disfrutando un mate en la playa - Bienvenido a CalmateVibes" />
            </div>
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[1] = el}
            style={{ animationDelay: '150ms' }}
          >
            <Tienda color1="#b7c774" />
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[2] = el}
            style={{ animationDelay: '300ms' }}
          >
            <SectionDividerImage 
              src="/divisor-beige.jpg" 
              alt="Divisor decorativo animado - Separador de secciones" 
              height="50px" 
            />
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[3] = el}
            style={{ animationDelay: '450ms' }}
          >
            <CuradosBanner
              title="Cuidados del Mate"
              text="Te recomendamos cómo cuidar y mantener tu mate para disfrutarlo por más tiempo."
              imageUrl="/javi-mate.jpeg"
            />
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[4] = el}
            style={{ animationDelay: '600ms' }}
          >
            <SectionDividerImage 
              src="/divisor-beige.jpg" 
              alt="Divisor decorativo animado - Separador de secciones" 
              height="50px" 
            />
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[5] = el}
            style={{ animationDelay: '750ms' }}
          >
            <Content
              title="Seguinos en nuestras redes"
              color1="#b7c774"
              color2="#52691a"
              colorTitle="#52691a"
            />
          </div>

          <div 
            className={`fade-section ${prefersReducedMotion ? 'no-motion' : ''}`}
            ref={(el) => sectionRefs.current[6] = el}
            style={{ animationDelay: '900ms' }}
          >
            <InstagramFeed background="#000000ff" />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;