// src/pages/Contact.js
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Content from '../components/Content.js';
import InstagramFeed from '../components/InstagramFeed.js';
import WhatsappButton from '../components/WhatsappButton.js';
import './styles/Contact.css';

function Contact() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detectar preferencia de motion reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Inicializar AOS solo si no se prefiere motion reducido
    if (!mediaQuery.matches) {
      AOS.init({ 
        duration: 600, 
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });
    }
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="contact-page-wrapper">
      <Header />
      
      {/* Hero Section */}
      <div className="contact-hero-section">
        <div className="contact-content-container">
          <h1 className="contact-hero-title">Contactanos</h1>
          <p className="contact-hero-subtitle">
            Seguinos en nuestras redes sociales y contactanos directamente por WhatsApp
          </p>
        </div>
      </div>

      <div className="contact-content-container">
        {/* Instagram Section */}
        <div 
          className="contact-section instagram-section"
          data-aos={!prefersReducedMotion ? "fade-up" : undefined}
          data-aos-delay="100"
        >
          <Content
            title="Seguinos en Instagram"
            lead="Descubrí nuestros productos, novedades y el mundo del mate"
            color1="#b7c774"
            color2="#52691a"
            colorTitle='#ffffff'
            colorLead='#ffffff'
          />
          <InstagramFeed background="transparent" />
        </div>

        {/* WhatsApp Section */}
        <div 
          className="contact-section whatsapp-section"
          data-aos={!prefersReducedMotion ? "fade-up" : undefined}
          data-aos-delay="200"
        >
          <Content
            title="Contactanos por WhatsApp"
            lead="¿Tenés alguna consulta? ¡Escribinos y te respondemos al instante!"
            color1="#52691a"
            color2="#b7c774"
            colorTitle='#ffffff'
            colorLead='#ffffff'
          >
            <WhatsappButton text="Enviar mensaje" />
          </Content>
        </div>

        {/* Additional Contact Methods Section */}
        <div 
          className="contact-section"
          data-aos={!prefersReducedMotion ? "fade-up" : undefined}
          data-aos-delay="300"
        >
          <Content
            title="Otras formas de contacto"
            lead="También podés encontrarnos en"
            color1="#f8f9fa"
            color2="#e9ecef"
            colorTitle='#52691a'
            colorLead='#666666'
          >
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <i className="bi bi-envelope-fill"></i>
                <span>info@calmatevibes.com</span>
              </div>
              <div className="contact-info-item">
                <i className="bi bi-telephone-fill"></i>
                <span>+54 280 466-6566</span>
              </div>
              <div className="contact-info-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>Puerto Madryn, Chubut</span>
              </div>
            </div>
          </Content>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;
