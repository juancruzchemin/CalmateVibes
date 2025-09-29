const mongoose = require('mongoose');
const Producto = require('../models/Producto');
require('dotenv').config();

const productos = [
  {
    nombre: "Mate Imperial Clásico",
    categoria: "mates",
    campos: {
      forma: "Imperial",
      tipo: "Calabaza",
      anchoSuperior: "Ancho",
      anchoInferior: "Medio",
      virola: "Si",
      tiposDeVirola: "Alpaca",
      guarda: "No",
      revestimiento: "No",
      curados: "Si",
      tiposDeCurados: "Curado de calabaza",
      terminacion: "Brillante",
      grabado: "No",
      color: "Natural"
    },
    stock: 15,
    precioCompra: 2500,
    precioVenta: 4500,
    descripcion: "Mate imperial tradicional de calabaza con virola de alpaca"
  },
  {
    nombre: "Bombilla Premium Acero",
    categoria: "bombillas",
    campos: {
      forma: "Recta",
      tipoMaterial: "Acero inoxidable",
      tamaño: "Mediana"
    },
    stock: 30,
    precioCompra: 800,
    precioVenta: 1500,
    descripcion: "Bombilla de acero inoxidable, tamaño mediano"
  }
];

const seedData = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Producto.deleteMany({});
    console.log('🗑️  Datos existentes eliminados');

    // Insertar datos de prueba
    await Producto.insertMany(productos);
    console.log('✅ Datos de prueba insertados');

    console.log('\n📊 Productos creados:');
    productos.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre} (${producto.categoria})`);
    });

    await mongoose.connection.close();
    console.log('\n🔒 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedData();