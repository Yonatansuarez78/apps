import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../componentes/Navbar';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore";

import { mostrarFacturaPasteleria } from '../utils/facturaUtil'

import { CarritoContext } from "../context/CarritoContext";

function Pasteleria() {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: '', precioUnitario: '', tipo: '' });
    const [productoAActualizar, setProductoAActualizar] = useState(null);

    const db = getFirestore();
    const { añadirProductoAlCarrito } = useContext(CarritoContext);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Ventas Pasteleria'), (snapshot) => {
            const productosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosData.reverse());
        });

        return () => unsubscribe();
    }, [db]);

    const agregarProducto = async () => {
        try {
            if (!nuevoProducto.nombre || !nuevoProducto.cantidad || !nuevoProducto.precioUnitario || !nuevoProducto.tipo) {
                throw new Error("Por favor, completa todos los campos.");
            }
            const cantidadNumero = parseFloat(nuevoProducto.cantidad);
            const precioUnitarioNumero = parseFloat(nuevoProducto.precioUnitario);

            // Asegurarse de que los valores sean números válidos
            if (isNaN(cantidadNumero) || isNaN(precioUnitarioNumero)) {
                throw new Error("Cantidad o precio unitario no son válidos.");
            }

            const producto = {
                nombre: nuevoProducto.nombre,
                cantidad: cantidadNumero,
                precioUnitario: precioUnitarioNumero,
                precioTotal: precioUnitarioNumero * cantidadNumero, // Calcular el precio total
                tipo: nuevoProducto.tipo,
                fecha: new Date()
            };

            console.log(producto);
            const docRef = await addDoc(collection(db, 'Ventas Pasteleria'), producto);

            // Generar la factura y obtener su ID
            const facturaId = await generarFactura({ ...producto, id: docRef.id }, docRef.id); // Pasar el ID del pedido
            console.log(facturaId);

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
            alert(error.message); // Muestra el mensaje de error al usuario
        }
    };



    const eliminarProducto = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmacion) {
            try {
                const productoRef = doc(db, 'Ventas Pasteleria', id);
                const productoDoc = await getDoc(productoRef);
                if (productoDoc.exists()) {
                    const facturaId = productoDoc.data().facturaId; // Asegúrate de que 'facturaId' es el campo correcto

                    // Eliminar el documento en la colección Ventas Panaderia
                    await deleteDoc(productoRef);
                    // Eliminar el documento en la colección Facturas Panaderia
                    const facturaRef = doc(db, 'Facturas Pasteleria', facturaId);
                    await deleteDoc(facturaRef);
                } else {
                    console.log("El documento en Ventas Panaderia no existe.");
                }
            } catch (error) {
                alert("Error al eliminar producto", error)
            }
        } else {
            console.log("Eliminación cancelada.");
        }
    };



    const actualizarProducto = async (id) => {
        try {
            const productoRef = doc(db, 'Ventas Pasteleria', id);

            // Obtener el documento actual para acceder a `facturaId`
            const productoActualDoc = await getDoc(productoRef);

            if (!productoActualDoc.exists()) {
                console.error('No se encontró el documento de producto con ID:', id);
                return;
            }

            const productoActual = productoActualDoc.data();

            // Obtener el ID de la factura desde el producto actual
            const facturaId = productoActual.facturaId; // Asegúrate de que este campo exista

            // Recalcular el precioTotal en base a los nuevos valores
            const nuevoPrecioTotal =
                (parseFloat(nuevoProducto.cantidad || productoActual.cantidad) *
                    parseFloat(nuevoProducto.precioUnitario || productoActual.precioUnitario)) || 0;

            // Actualizar el producto en Ventas Pasteleria
            await updateDoc(productoRef, {
                nombre: nuevoProducto.nombre,
                cantidad: nuevoProducto.cantidad,
                precioUnitario: nuevoProducto.precioUnitario,
                tipo: nuevoProducto.tipo,
                precioTotal: nuevoPrecioTotal // Calcular el precio total
            });

            // Actualizar la factura en Facturas Pasteleria
            const productoRefFact = doc(db, 'Facturas Pasteleria', facturaId);
            await updateDoc(productoRefFact, {
                nombre: nuevoProducto.nombre,
                cantidad: nuevoProducto.cantidad,
                precioUnitario: nuevoProducto.precioUnitario,
                tipo: nuevoProducto.tipo,
                precioTotal: nuevoPrecioTotal // Calcular el precio total
            });

            // Limpiar los estados
            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', tipo: '' });
            setShowModal(false);
            setProductoAActualizar(null);

            console.log('Producto y factura actualizados exitosamente');
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

    const AñadirAlCarrito = () => {
        if (nuevoProducto.nombre && nuevoProducto.cantidad && nuevoProducto.precioUnitario) {
            const productoConCategoria = {
                ...nuevoProducto,
                categoria: 'pasteleria' // Cambia esto a 'pasteleria' según sea necesario
            };
            añadirProductoAlCarrito(productoConCategoria);
            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', precioTotal: '' });
            setShowModal(false);
        } else {
            alert("Todos los campos son requeridos");
        }
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
                            <button type="button" className="btn btn-success" onClick={AñadirAlCarrito} >Agregar Mas Producto</button>
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
