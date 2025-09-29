const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true,
    enum: ['mates', 'bombillas', 'combos']
  },
  descripcion: {
    type: String,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  activa: {
    type: Boolean,
    default: true
  },
  // Configuración de campos y opciones para cada categoría
  configuracion: {
    campos: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    opciones: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  orden: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices
CategoriaSchema.index({ nombre: 1 });
CategoriaSchema.index({ activa: 1, orden: 1 });

module.exports = mongoose.model('Categoria', CategoriaSchema);