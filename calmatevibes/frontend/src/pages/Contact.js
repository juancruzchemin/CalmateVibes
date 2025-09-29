// src/pages/Home.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Content from '../components/Content.js';
import InstagramFeed from '../components/InstagramFeed.js';
import WhatsappButton from '../components/WhatsappButton.js';


function Contact() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Header />
      <div data-aos="fade-up">
        <Content
          title="Seguinos en instagram"
          lead=""
          color1="#b7c774"
          color2="#52691a"
          colorTitle='#52691a'
        >
        </Content>
      </div>
      <div data-aos="fade-up">
        <InstagramFeed background="#000000ff" />
      </div>
      <div data-aos="fade-up">
        <Content
          title="Contactanos por WhatsApp"
          lead=""
          color1="#52691a"
          color2="#b7c774"
        >
          <WhatsappButton text="Abrir en WhatsApp" />
        </Content >
      </div>
      <Footer />
    </>
  );
}

export default Contact;
