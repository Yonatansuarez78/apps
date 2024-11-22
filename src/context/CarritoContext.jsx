import React, { createContext, useState, useEffect } from "react";
import { Toast, ToastContainer } from 'react-bootstrap';
import { collection, addDoc, getFirestore, updateDoc, getDoc, doc } from 'firebase/firestore'; // Asegúrate de importar addDoc y collection
import { mostrarFacturaPedido } from '../utils/facturaUtil'



export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    
    const [carrito, setCarrito] = useState(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    const db = getFirestore();

    const [mostrarToast, setMostrarToast] = useState(false);

    const añadirProductoAlCarrito = (producto) => {
        const nuevoCarrito = [...carrito, producto];
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setMostrarToast(true);
        fecha: new Date()
    };

    const eliminarProductoDelCarrito = (index) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este pedido?');
        if (confirmar) {
            const nuevoCarrito = carrito.filter((_, i) => i !== index);
            setCarrito(nuevoCarrito);
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        }
    };


    const editarProductoEnCarrito = (index, nuevoProducto) => {
        const nuevoCarrito = carrito.map((item, i) => (i === index ? nuevoProducto : item));
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);


    const finalizarPedido = async () => {
        const confirmar = window.confirm('¿Estás seguro de que deseas confirmar este pedido?');
        if (confirmar){
            try {
                // Actualizamos los productos en el carrito con el precioTotal si no existe
                const carritoActualizado = carrito.map(producto => {
                    const precioTotal = producto.precioTotal
                        ? producto.precioTotal // Si ya tiene datos, usar el valor existente
                        : producto.precioUnitario * producto.cantidad; // Si no, calcular el total

                    return {
                        ...producto, // Copiar las demás propiedades del producto
                        precioTotal: precioTotal // Actualizar o establecer precioTotal
                    };
                });

                // Sumar el total del pedido usando precioTotal
                const totalPedido = carritoActualizado.reduce((total, producto) => total + parseFloat(producto.precioTotal), 0);

                // Guardar el pedido en la colección 'Ventas Pedido'
                const docRef = await addDoc(collection(db, 'Ventas Pedido'), {
                    carrito: carritoActualizado, // Los productos en el carrito actualizados
                    fecha: new Date(), // Fecha del pedido
                    total: totalPedido, // Total calculado con precios totales
                });

                // Guardar la factura en la colección 'Factura Ventas Pedido'
                const facturaRef = await addDoc(collection(db, 'Factura Ventas Pedido'), {
                    carrito: carritoActualizado, // Los productos en el carrito actualizados
                    fecha: new Date(), // Fecha del pedido
                    total: totalPedido, // Total de la factura
                    idVenta: docRef.id // Relacionar con el ID del pedido
                });

                // Actualizar el pedido en la colección 'Ventas Pedido' con el ID de la factura
                await updateDoc(docRef, {
                    facturaId: facturaRef.id // Agregar el ID de la factura al documento del pedido
                });

                // Mostrar el total de la compra finalizada
                alert('Pedido finalizado con éxito. Numero de pedido: ' + docRef.id);
                mostrarFacturaPedido({
                    carrito: carritoActualizado,
                    fecha: new Date(),
                    total: totalPedido
                });

                // Limpiar el carrito después de finalizar el pedido
                setCarrito([]);
                localStorage.removeItem("carrito");
                setMostrarToast(false);

            } catch (e) {
                console.error('Error al finalizar el pedido: ', e);
                alert('Error al guardar el pedido');
            }
        } 
    };



    const cancelarPedido = () => {
        const confirmar = window.confirm('¿Estás seguro de que deseas cancelar el pedido?');
        if (confirmar) {
            setCarrito([]);
            localStorage.removeItem("carrito");
            setMostrarToast(false);
        }
    };

    return (
        <CarritoContext.Provider value={{ carrito, añadirProductoAlCarrito, eliminarProductoDelCarrito, editarProductoEnCarrito }}>
            {children}

            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay={500000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Producto Añadido</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {carrito.length > 0 &&
                            carrito.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        Producto: {item.nombre} - Cantidad: {item.cantidad}
                                    </div>
                                    <div>
                                        <i className="bi bi-pencil"
                                            onClick={() => {
                                                const nuevaCantidad = prompt('Ingresa la nueva cantidad:', item.cantidad);
                                                if (nuevaCantidad !== null) {
                                                    editarProductoEnCarrito(index, { ...item, cantidad: nuevaCantidad });
                                                }
                                            }}
                                            style={{ cursor: 'pointer', marginRight: '10px' }}></i>
                                        <i className="bi bi-trash"
                                            onClick={() => eliminarProductoDelCarrito(index)}
                                            style={{ cursor: 'pointer' }}></i>
                                    </div>
                                </div>
                            ))}
                    </Toast.Body>
                    <button type="button" className="btn btn-secondary m-2" onClick={cancelarPedido}>Cancelar pedido</button>
                    <button type="button" className="btn btn-success" onClick={finalizarPedido}>Finalizar pedido</button>
                </Toast>
            </ToastContainer>

            {/* Ícono del carrito */}
            {carrito.length > 0 && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer' }}>
                    <i className="bi bi-cart-plus-fill" style={{ fontSize: '24px' }} onClick={() => setMostrarToast(true)}></i>
                    <span>{carrito.length}</span>
                </div>
            )}
        </CarritoContext.Provider>
    );
};
