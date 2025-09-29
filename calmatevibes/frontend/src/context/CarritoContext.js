import React, { createContext, useState } from 'react';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (item) => {
        setCarrito((prevCarrito) => {
            const itemExistente = prevCarrito.find((prod) => prod.id === item.id);
            if (itemExistente) {
                return prevCarrito.map((prod) =>
                    prod.id === item.id ? { ...prod, cantidad: prod.cantidad + item.cantidad } : prod
                );
            }
            return [...prevCarrito, { ...item, cantidad: item.cantidad }];
        });
    };

    const eliminarDelCarrito = (itemId) => {
        setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== itemId));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const actualizarCantidad = (itemId, nuevaCantidad) => {
        setCarrito((prevCarrito) =>
            prevCarrito.map((item) =>
                item.id === itemId ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
    };

    return (
        <CarritoContext.Provider
            value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad }}
        >
            {children}
        </CarritoContext.Provider>
    );
};