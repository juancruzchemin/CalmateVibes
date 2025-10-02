// src/pages/Home.js
import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Content from '../components/layout/Content';
import InstagramFeed from '../components/home/InstagramFeed';

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
