// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Content from '../components/Content';
import InstagramFeed from '../components/InstagramFeed';

function About() {
  return (
    <>
      <Header />
       <Content
          title="Seguinos en instagram"
          lead=""
          color1="#b7c774"
          color2="#52691a"
        >          
        </Content>
        <InstagramFeed background="#ffffff" />
         <Content
          title="Contactanos por WhatsApp"
          lead=""
          color1="#b7c774"
          color2="#52691a"
        >
        </Content>
      <Footer />
    </>
  );
}

export default About;
