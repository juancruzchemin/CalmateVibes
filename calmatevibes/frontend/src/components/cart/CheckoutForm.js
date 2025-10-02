// src/components/cart/CheckoutForm.js
import React, { useState, useEffect } from 'react';
import './styles/CheckoutForm.css';

function CheckoutForm({
    initialData,
    onSubmit,
    onBack,
    // Props para CartSummary
    items = [],
    itemCount = 0,
    subtotal = 0,
    total = 0,
    envio = 0,
    showShipping = false
}) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        notas: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        // Nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        // Teléfono
        const telefonoRegex = /^[\d\s\-+()]{8,}$/;
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'El teléfono no es válido';
        }

        // Dirección
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        } else if (formData.direccion.trim().length < 5) {
            newErrors.direccion = 'La dirección debe ser más específica';
        }

        // Ciudad
        if (!formData.ciudad.trim()) {
            newErrors.ciudad = 'La ciudad es requerida';
        }

        // Código Postal
        if (!formData.codigoPostal.trim()) {
            newErrors.codigoPostal = 'El código postal es requerido';
        } else if (formData.codigoPostal.trim().length < 4) {
            newErrors.codigoPostal = 'El código postal no es válido';
        }

        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-form">
            {/* Vista móvil - Desplegables paso a paso */}
            <div className="mobile-checkout-steps">

                {/* Paso 1: Productos en tu carrito - Completado (cerrado con check) */}
                <div className="mobile-step-section completed">
                    <div className="mobile-step-header">
                        <div className="step-info">
                            <span className="step-number">1</span>
                            <span className="step-title">Productos en tu carrito</span>
                        </div>
                        <div className="step-status">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                    {/* Este desplegable siempre está cerrado */}
                </div>

                {/* Paso 2: Datos de envío - Activo (abierto con el formulario y summary) */}
                <div className="mobile-step-section active">
                    <div className="mobile-step-header">
                        <div className="step-info">
                            <span className="step-number">2</span>
                            <span className="step-title">Datos de envío</span>
                        </div>
                        <div className="step-status">
                            <i className="bi bi-chevron-down"></i>
                        </div>
                    </div>
                    <div className="mobile-step-content">
                        {/* Formulario de checkout */}
                        <form onSubmit={handleSubmit} className="checkout-form-content">
                            {/* Personal Information */}
                            <div className="checkout-form-section">
                                <h3 className="checkout-section-title">Datos Personales</h3>

                                <div className="checkout-form-group">
                                    <label htmlFor="nombre" className="checkout-form-label">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className={`checkout-form-input ${errors.nombre ? 'checkout-input-error' : ''}`}
                                        placeholder="Ingresa tu nombre completo"
                                        autoComplete="name"
                                    />
                                    {errors.nombre && <span className="checkout-form-error">{errors.nombre}</span>}
                                </div>

                                <div className="checkout-form-row">
                                    <div className="checkout-form-group">
                                        <label htmlFor="email" className="checkout-form-label">
                                            Email *
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`checkout-form-input ${errors.email ? 'checkout-input-error' : ''}`}
                                            placeholder="tu@email.com"
                                            autoComplete="email"
                                        />
                                        {errors.email && <span className="checkout-form-error">{errors.email}</span>}
                                    </div>

                                    <div className="checkout-form-group">
                                        <label htmlFor="telefono" className="checkout-form-label">
                                            Teléfono *
                                        </label>
                                        <input
                                            id="telefono"
                                            name="telefono"
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            className={`checkout-form-input ${errors.telefono ? 'checkout-input-error' : ''}`}
                                            placeholder="+54 280 123-4567"
                                            autoComplete="tel"
                                        />
                                        {errors.telefono && <span className="checkout-form-error">{errors.telefono}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="checkout-form-section">
                                <h3 className="checkout-section-title">Dirección de Envío</h3>

                                <div className="checkout-form-group">
                                    <label htmlFor="direccion" className="checkout-form-label">
                                        Dirección *
                                    </label>
                                    <input
                                        id="direccion"
                                        name="direccion"
                                        type="text"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        className={`checkout-form-input ${errors.direccion ? 'checkout-input-error' : ''}`}
                                        placeholder="Calle, número, piso, departamento"
                                        autoComplete="street-address"
                                    />
                                    {errors.direccion && <span className="checkout-form-error">{errors.direccion}</span>}
                                </div>

                                <div className="checkout-form-row">
                                    <div className="checkout-form-group">
                                        <label htmlFor="ciudad" className="checkout-form-label">
                                            Ciudad *
                                        </label>
                                        <input
                                            id="ciudad"
                                            name="ciudad"
                                            type="text"
                                            value={formData.ciudad}
                                            onChange={handleInputChange}
                                            className={`checkout-form-input ${errors.ciudad ? 'checkout-input-error' : ''}`}
                                            placeholder="Tu ciudad"
                                            autoComplete="address-level2"
                                        />
                                        {errors.ciudad && <span className="checkout-form-error">{errors.ciudad}</span>}
                                    </div>

                                    <div className="checkout-form-group">
                                        <label htmlFor="codigoPostal" className="checkout-form-label">
                                            Código Postal *
                                        </label>
                                        <input
                                            id="codigoPostal"
                                            name="codigoPostal"
                                            type="text"
                                            value={formData.codigoPostal}
                                            onChange={handleInputChange}
                                            className={`checkout-form-input ${errors.codigoPostal ? 'checkout-input-error' : ''}`}
                                            placeholder="9120"
                                            autoComplete="postal-code"
                                        />
                                        {errors.codigoPostal && <span className="checkout-form-error">{errors.codigoPostal}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="checkout-form-section">
                                <div className="checkout-form-group">
                                    <label htmlFor="notas" className="checkout-form-label">
                                        Notas del Pedido (Opcional)
                                    </label>
                                    <textarea
                                        id="notas"
                                        name="notas"
                                        value={formData.notas}
                                        onChange={handleInputChange}
                                        className="checkout-form-textarea"
                                        placeholder="Información adicional sobre la entrega..."
                                        rows="3"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="checkout-form-actions">
                                <button
                                    type="button"
                                    className="checkout-btn-back"
                                    onClick={onBack}
                                    disabled={isSubmitting}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Volver al Carrito
                                </button>

                                <button
                                    type="submit"
                                    className="checkout-btn-continue"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="checkout-spinner"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Continuar al Pago
                                            <i className="bi bi-arrow-right"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>                
            </div>

            {/* Vista desktop - formulario tradicional */}
            <div className="desktop-checkout">
                <h2 className="checkout-form-title">Información de Envío</h2>

                <form onSubmit={handleSubmit} className="checkout-form-content">
                    {/* Personal Information */}
                    <div className="checkout-form-section">
                        <h3 className="checkout-section-title">Datos Personales</h3>

                        <div className="checkout-form-group">
                            <label htmlFor="nombre-desktop" className="checkout-form-label">
                                Nombre Completo *
                            </label>
                            <input
                                id="nombre-desktop"
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className={`checkout-form-input ${errors.nombre ? 'checkout-input-error' : ''}`}
                                placeholder="Ingresa tu nombre completo"
                                autoComplete="name"
                            />
                            {errors.nombre && <span className="checkout-form-error">{errors.nombre}</span>}
                        </div>

                        <div className="checkout-form-row">
                            <div className="checkout-form-group">
                                <label htmlFor="email-desktop" className="checkout-form-label">
                                    Email *
                                </label>
                                <input
                                    id="email-desktop"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`checkout-form-input ${errors.email ? 'checkout-input-error' : ''}`}
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                />
                                {errors.email && <span className="checkout-form-error">{errors.email}</span>}
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="telefono-desktop" className="checkout-form-label">
                                    Teléfono *
                                </label>
                                <input
                                    id="telefono-desktop"
                                    name="telefono"
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    className={`checkout-form-input ${errors.telefono ? 'checkout-input-error' : ''}`}
                                    placeholder="+54 280 123-4567"
                                    autoComplete="tel"
                                />
                                {errors.telefono && <span className="checkout-form-error">{errors.telefono}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="checkout-form-section">
                        <h3 className="checkout-section-title">Dirección de Envío</h3>

                        <div className="checkout-form-group">
                            <label htmlFor="direccion-desktop" className="checkout-form-label">
                                Dirección *
                            </label>
                            <input
                                id="direccion-desktop"
                                name="direccion"
                                type="text"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                className={`checkout-form-input ${errors.direccion ? 'checkout-input-error' : ''}`}
                                placeholder="Calle, número, piso, departamento"
                                autoComplete="street-address"
                            />
                            {errors.direccion && <span className="checkout-form-error">{errors.direccion}</span>}
                        </div>

                        <div className="checkout-form-row">
                            <div className="checkout-form-group">
                                <label htmlFor="ciudad-desktop" className="checkout-form-label">
                                    Ciudad *
                                </label>
                                <input
                                    id="ciudad-desktop"
                                    name="ciudad"
                                    type="text"
                                    value={formData.ciudad}
                                    onChange={handleInputChange}
                                    className={`checkout-form-input ${errors.ciudad ? 'checkout-input-error' : ''}`}
                                    placeholder="Tu ciudad"
                                    autoComplete="address-level2"
                                />
                                {errors.ciudad && <span className="checkout-form-error">{errors.ciudad}</span>}
                            </div>

                            <div className="checkout-form-group">
                                <label htmlFor="codigoPostal-desktop" className="checkout-form-label">
                                    Código Postal *
                                </label>
                                <input
                                    id="codigoPostal-desktop"
                                    name="codigoPostal"
                                    type="text"
                                    value={formData.codigoPostal}
                                    onChange={handleInputChange}
                                    className={`checkout-form-input ${errors.codigoPostal ? 'checkout-input-error' : ''}`}
                                    placeholder="9120"
                                    autoComplete="postal-code"
                                />
                                {errors.codigoPostal && <span className="checkout-form-error">{errors.codigoPostal}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="checkout-form-section">
                        <div className="checkout-form-group">
                            <label htmlFor="notas-desktop" className="checkout-form-label">
                                Notas del Pedido (Opcional)
                            </label>
                            <textarea
                                id="notas-desktop"
                                name="notas"
                                value={formData.notas}
                                onChange={handleInputChange}
                                className="checkout-form-textarea"
                                placeholder="Información adicional sobre la entrega..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="checkout-form-actions">
                        <button
                            type="button"
                            className="checkout-btn-back"
                            onClick={onBack}
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Volver al Carrito
                        </button>

                        <button
                            type="submit"
                            className="checkout-btn-continue"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="checkout-spinner"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Continuar al Pago
                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutForm;