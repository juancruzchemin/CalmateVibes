const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Elegir URI según el entorno
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_CLOUD 
      : process.env.MONGODB_URI;

    console.log(`🔄 Conectando a MongoDB (${process.env.NODE_ENV})...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Event listeners para debugging
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB desconectado');
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // Si es desarrollo local y falla, dar instrucciones
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📋 Para solucionar:');
      console.log('1. Instala MongoDB: https://www.mongodb.com/try/download/community');
      console.log('2. Ejecuta: mongod');
      console.log('3. O usa MongoDB Atlas y actualiza MONGODB_URI_CLOUD\n');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;