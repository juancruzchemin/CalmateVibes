import React, { createContext, useState, useEffect, useContext } from 'react';
import carritoService from '../services/carritoService';

export const CarritoContext = createContext();

// Hook personalizado para usar el contexto
export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
    }
    return context;
};

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    // Obtener token del usuario si está logueado
    const getToken = () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user).token : null;
        } catch {
            return null;
        }
    };

    // Cargar carrito al inicializar
    useEffect(() => {
        cargarCarrito();
    }, []);

    // Función para cargar carrito desde la API
    const cargarCarrito = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getToken();
            const response = await carritoService.obtenerCarrito(token);
            
            if (response.success) {
                const carritoData = response.data;
                const items = carritoData.items || [];
                
                console.log('🛒 Items originales:', items);
                
                // Aplanar la estructura para que sea más fácil de usar en el frontend
                const itemsAplanados = items.map(item => {
                    // Si el item tiene producto poblado, fusionar los datos
                    if (item.producto) {
                        return {
                            _id: item.producto._id,
                            id: item.producto._id,
                            nombre: item.producto.nombre,
                            precioVenta: item.producto.precioVenta,
                            precioUnitario: item.precioUnitario,
                            // Procesar imágenes correctamente
                            imagenes: item.producto.imagenes || [],
                            // Para compatibilidad, agregar también la primera imagen como string
                            imagen: item.producto.imagenes?.[0]?.url || item.producto.imagenes?.[0] || null,
                            categoria: item.producto.categoria,
                            stock: item.producto.stock,
                            cantidad: item.cantidad,
                            // Mantener referencia original
                            itemOriginal: item
                        };
                    } else {
                        // Si no hay producto poblado, usar los datos directos
                        return {
                            ...item,
                            id: item._id || item.id
                        };
                    }
                });
                
                console.log('🛒 Items aplanados:', itemsAplanados);
                
                // Debug: Verificar estructura de imágenes y precios
                itemsAplanados.forEach(item => {
                    console.log('📦 Item procesado:', {
                        nombre: item.nombre,
                        precioVenta: item.precioVenta,
                        precioUnitario: item.precioUnitario,
                        imagen: item.imagen,
                        imagenes: item.imagenes
                    });
                });
                
                setCarrito(itemsAplanados);
                setTotal(carritoData.total || 0);
                setCantidadTotal(carritoData.cantidadTotalItems || 0);
                
                console.log('🛒 Carrito cargado:', carritoData);
            }
        } catch (err) {
            console.error('❌ Error cargando carrito:', err);
            setError('Error al cargar el carrito');
            // En caso de error, mantener carrito vacío
            setCarrito([]);
            setTotal(0);
            setCantidadTotal(0);
        } finally {
            setLoading(false);
        }
    };

    // Agregar producto al carrito
    const agregarAlCarrito = async (producto) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getToken();
            const productoId = producto._id || producto.id;
            const cantidad = producto.cantidad || 1;
            
            console.log('🛒 Agregando al carrito:', { productoId, cantidad });
            
            const response = await carritoService.agregarProducto(productoId, cantidad, token);
            
            if (response.success) {
                // Recargar carrito después de agregar
                await cargarCarrito();
                console.log('✅ Producto agregado al carrito');
                return { success: true };
            }
        } catch (err) {
            console.error('❌ Error agregando al carrito:', err);
            setError('Error al agregar producto al carrito');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar cantidad de un producto
    const actualizarCantidad = async (productoId, nuevaCantidad) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getToken();
            
            console.log('🛒 Actualizando cantidad:', { productoId, nuevaCantidad });
            
            const response = await carritoService.actualizarCantidad(productoId, nuevaCantidad, token);
            
            if (response.success) {
                // Recargar carrito después de actualizar
                await cargarCarrito();
                console.log('✅ Cantidad actualizada');
                return { success: true };
            }
        } catch (err) {
            console.error('❌ Error actualizando cantidad:', err);
            setError('Error al actualizar cantidad');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar producto del carrito
    const eliminarDelCarrito = async (productoId) => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getToken();
            
            console.log('🛒 Eliminando del carrito:', productoId);
            
            const response = await carritoService.eliminarProducto(productoId, token);
            
            if (response.success) {
                // Recargar carrito después de eliminar
                await cargarCarrito();
                console.log('✅ Producto eliminado del carrito');
                return { success: true };
            }
        } catch (err) {
            console.error('❌ Error eliminando del carrito:', err);
            setError('Error al eliminar producto del carrito');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Vaciar todo el carrito
    const vaciarCarrito = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = getToken();
            
            console.log('🛒 Vaciando carrito');
            
            const response = await carritoService.limpiarCarrito(token);
            
            if (response.success) {
                // Limpiar estado local
                setCarrito([]);
                setTotal(0);
                setCantidadTotal(0);
                console.log('✅ Carrito vaciado');
                return { success: true };
            }
        } catch (err) {
            console.error('❌ Error vaciando carrito:', err);
            setError('Error al vaciar el carrito');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Validar carrito (verificar stock, precios)
    const validarCarrito = async () => {
        try {
            const token = getToken();
            const response = await carritoService.validarCarrito(token);
            return response;
        } catch (err) {
            console.error('❌ Error validando carrito:', err);
            return { success: false, error: err.message };
        }
    };

    const value = {
        // Estado
        carrito,
        loading,
        error,
        total,
        cantidadTotal,
        
        // Funciones
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
        cargarCarrito,
        validarCarrito
    };

    return (
        <CarritoContext.Provider value={value}>
            {children}
        </CarritoContext.Provider>
    );
};