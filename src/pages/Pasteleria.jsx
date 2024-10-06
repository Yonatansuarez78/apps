import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore";

import { mostrarFacturaPasteleria } from '../utils/facturaUtil'

function Pasteleria() {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: '', precioUnitario: '', tipo: '' });
    const [productoAActualizar, setProductoAActualizar] = useState(null);

    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Ventas Pasteleria'), (snapshot) => {
            const productosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosData.reverse());
        });

        return () => unsubscribe();
    }, [db]);

    const agregarProducto = async () => {
        try {
            const producto = {
                nombre: nuevoProducto.nombre,
                cantidad: nuevoProducto.cantidad,
                precioUnitario: nuevoProducto.precioUnitario,
                precioTotal: nuevoProducto.precioUnitario * cantidad,
                tipo: nuevoProducto.tipo,
                fecha: new Date()
            };

            const docRef = await addDoc(collection(db, 'Ventas Pasteleria'), producto);

            // Generar la factura y obtener su ID
            const facturaId = await generarFactura({ ...producto, id: docRef.id }, docRef.id); // Pasar el ID del pedido

            // Actualizar el producto con el ID de la factura
            if (facturaId) {
                await updateDoc(docRef, {
                    facturaId: facturaId, // Almacenar el ID de la factura en el producto
                });
            }
            
            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', tipo: '', fecha: '' });
            setShowModal(false);
        } catch (error) {
            console.error("Error al agregar producto: ", error);
        }
    };

    const eliminarProducto = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmacion) {
            try {
                const productoRef = doc(db, 'Ventas Pasteleria', id);
                await deleteDoc(productoRef);
                console.log("Producto eliminado con éxito.");
            } catch (error) {
                console.error("Error al eliminar producto: ", error);
            }
        } else {
            console.log("Eliminación cancelada.");
        }
    };

    const actualizarProducto = async (id) => {
        try {
            const productoRef = doc(db, 'Ventas Pasteleria', id);
            await updateDoc(productoRef, {
                nombre: nuevoProducto.nombre,
                cantidad: nuevoProducto.cantidad,
                precioUnitario: nuevoProducto.precioUnitario,
                tipo: nuevoProducto.tipo
            });
            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', tipo: '' });
            setShowModal(false);
            setProductoAActualizar(null);
        } catch (error) {
            console.error("Error al actualizar producto: ", error);
        }
    };

    const abrirModalActualizar = (producto) => {
        setNuevoProducto({
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precioUnitario: producto.precioUnitario,
            tipo: producto.tipo
        });
        setProductoAActualizar(producto.id);
        setShowModal(true);
    };

    // Funcionalidad de la factura
    const generarFactura = async (producto, idVenta) => {
        try {
            const factura = {
                nombre: producto.nombre,
                cantidad: producto.cantidad,
                tipo: producto.tipo,
                precioUnitario: producto.precioUnitario,
                precioTotal: producto.cantidad * producto.precioUnitario,
                fecha: new Date()
            };

            const docRef = await addDoc(collection(db, 'Facturas Pasteleria'), factura);
            await updateDoc(docRef, {
                idVenta: idVenta, // Guardar el ID de la venta en la factura
            });

            const confirmarDescarga = window.confirm("¿Deseas descargar la factura?");
            if (confirmarDescarga) {
                mostrarFacturaPasteleria(factura);
            }

            return docRef.id; // Retornar el ID de la factura
        } catch (error) {
            console.error("Error al generar factura: ", error);
        }
    };



    const descargarFactura = (producto) => {
        const factura = {
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            tipo: producto.tipo,
            precioUnitario: producto.precioUnitario,
            precioTotal: producto.cantidad * producto.precioUnitario
        };
        mostrarFacturaPasteleria(factura);
    };


    return (
        <div>
            <Navbar />
            <button type="button" className="btn btn-primary m-2" onClick={() => {
                setShowModal(true);
                setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', tipo: '' });
                setProductoAActualizar(null);
            }}>
                Agregar Producto
            </button>

            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{productoAActualizar ? 'Actualizar Producto' : 'Agregar Producto'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre del Producto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={nuevoProducto.nombre}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cantidad"
                                    value={nuevoProducto.cantidad}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">Precio Unitario</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="precio"
                                    value={nuevoProducto.precioUnitario}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precioUnitario: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">Tipo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tipo"
                                    value={nuevoProducto.tipo}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, tipo: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={() => productoAActualizar ? actualizarProducto(productoAActualizar) : agregarProducto()}>
                                {productoAActualizar ? 'Actualizar Producto' : 'Agregar Producto'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Tipo</th>
                            <th>Precio Unitario</th>
                            <th>Precio Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">No hay productos agregados</td>
                            </tr>
                        ) : (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>{producto.tipo}</td>
                                    <td>${producto.precioUnitario}</td>
                                    <td>${(producto.cantidad * producto.precioUnitario)}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm m-1" onClick={() => abrirModalActualizar(producto)}>Actualizar</button>
                                        <button className="btn btn-info btn-sm m-1" onClick={() => descargarFactura(producto)}>Imprimir</button>
                                        <button className="btn btn-danger btn-sm m-1" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pasteleria;
