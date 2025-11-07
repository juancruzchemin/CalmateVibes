const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // TEMPORAL: Usar local primero mientras solucionamos Atlas
    const mongoURI = process.env.MONGODB_URI_CLOUD || process.env.MONGODB_URI  ;

    const isAtlas = mongoURI.includes('mongodb+srv');
    console.log(`🔄 Conectando a MongoDB ${isAtlas ? '☁️ Atlas (Nube)' : '💻 Local'} (${process.env.NODE_ENV})...`);
    console.log(`🔗 URI: ${mongoURI.substring(0, 30)}...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🌐 Tipo: ${isAtlas ? '🚀 MongoDB Atlas (Nube)' : '💻 MongoDB Local'}`);
    
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
      console.log('1. Verifica MONGODB_URI_CLOUD en .env');
      console.log('2. Asegúrate de que la IP esté permitida en Atlas');
      console.log('3. O instala MongoDB local: https://www.mongodb.com/try/download/community');
      console.log('4. Y ejecuta: mongod\n');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;