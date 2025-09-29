const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const { validationResult } = require('express-validator');

// @desc    Obtener todas las categorías
// @route   GET /api/categorias
// @access  Public
exports.getCategorias = async (req, res) => {
  try {
    const filtros = {};
    
    // Filtro por estado activo
    if (req.query.incluirInactivas !== 'true') {
      filtros.activa = true;
    }

    const categorias = await Categoria.find(filtros)
      .sort({ orden: 1, nombre: 1 });

    // Obtener estadísticas de productos por categoría
    const statsPromises = categorias.map(async (categoria) => {
      const stats = await Producto.aggregate([
        { $match: { categoria: categoria.nombre, activo: true } },
        {
          $group: {
            _id: null,
            totalProductos: { $sum: 1 },
            stockTotal: { $sum: '$stock' },
            valorInventario: { $sum: { $multiply: ['$stock', '$precioCompra'] } }
          }
        }
      ]);

      return {
        ...categoria.toObject(),
        estadisticas: stats[0] || {
          totalProductos: 0,
          stockTotal: 0,
          valorInventario: 0
        }
      };
    });

    const categoriasConStats = await Promise.all(statsPromises);

    res.json({
      success: true,
      count: categorias.length,
      data: categoriasConStats
    });
  } catch (error) {
    console.error('Error en getCategorias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// @desc    Obtener categoría por ID
// @route   GET /api/categorias/:id
// @access  Public
exports.getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Obtener productos de la categoría
    const productos = await Producto.find({
      categoria: categoria.nombre,
      activo: true
    }).select('nombre stock precioVenta imagenes');

    res.json({
      success: true,
      data: {
        ...categoria.toObject(),
        productos
      }
    });
  } catch (error) {
    console.error('Error en getCategoria:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

// @desc    Crear nueva categoría
// @route   POST /api/categorias
// @access  Private
exports.createCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const categoria = await Categoria.create(req.body);

    res.status(201).json({
      success: true,
      data: categoria,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    console.error('Error en createCategoria:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// @desc    Actualizar categoría
// @route   PUT /api/categorias/:id
// @access  Private
exports.updateCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    console.error('Error en updateCategoria:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

// @desc    Eliminar categoría
// @route   DELETE /api/categorias/:id
// @access  Private
exports.deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay productos en esta categoría
    const productosEnCategoria = await Producto.countDocuments({
      categoria: categoria.nombre,
      activo: true
    });

    if (productosEnCategoria > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productosEnCategoria} producto(s) activo(s)`
      });
    }

    // Soft delete
    categoria.activa = false;
    await categoria.save();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteCategoria:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};