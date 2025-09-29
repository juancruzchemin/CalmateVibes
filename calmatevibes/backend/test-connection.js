require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI || 'No configurada');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI no está configurada en .env');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ ¡Conexión exitosa a MongoDB!');
    console.log('📊 Base de datos:', mongoose.connection.name);
    
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('🔒 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n📋 Soluciones posibles:');
      console.log('1. MongoDB no está corriendo. Ejecuta: mongod');
      console.log('2. O instala MongoDB desde: https://www.mongodb.com/try/download/community');
      console.log('3. O usa MongoDB Atlas (nube)');
    }
  }
};

testConnection();