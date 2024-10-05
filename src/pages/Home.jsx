import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../componentes/Navbar';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { mostrarFactura } from '../utils/facturaUtil';

import { CarritoContext } from "../context/CarritoContext";

function Home() {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: '', precioUnitario: '', precioTotal: '' });
    const [productoAActualizar, setProductoAActualizar] = useState(null);

    const { añadirProductoAlCarrito } = useContext(CarritoContext);


    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Ventas Panaderia'), (snapshot) => {
            const productosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosData.reverse());
        });

        return () => unsubscribe();
    }, [db]);

    const agregarProducto = async (  ) => {
        if (nuevoProducto.nombre && nuevoProducto.cantidad && nuevoProducto.precioUnitario) {
            try {
                // Calcular precioTotal dependiendo de si ya hay un valor o no
                const precioTotal = nuevoProducto.precioTotal
                    ? parseFloat(nuevoProducto.precioTotal) // Si existe, lo usamos
                    : nuevoProducto.cantidad * nuevoProducto.precioUnitario; // Si no, lo calculamos

                // Crear el objeto del producto
                const producto = {
                    nombre: nuevoProducto.nombre,
                    cantidad: nuevoProducto.cantidad,
                    precioUnitario: nuevoProducto.precioUnitario,
                    precioTotal: precioTotal, // Usamos el valor calculado o el proporcionado
                    fecha: new Date(),
                };
                const docRef = await addDoc(collection(db, 'Ventas Panaderia'), producto);

                // Generar la factura y obtener su ID
                const facturaId = await generarFactura({ ...producto, id: docRef.id }); // Pasar el ID del pedido

                // Actualizar el producto con el ID de la factura
                if (facturaId) {
                    await updateDoc(docRef, {
                        facturaId: facturaId, // Almacenar el ID de la factura en el producto
                    });
                }

                setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', precioTotal: '' });
                setShowModal(false);
            } catch (error) {
                console.error("Error al agregar producto: ", error);
            }
        } else {
            alert("Todos los campos son requeridos");
        }
    };




    const eliminarProducto = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (confirmacion) {
            try {
                const productoRef = doc(db, 'Ventas Panaderia', id);
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
            const productoRef = doc(db, 'Ventas Panaderia', id);

            // Obtener el producto actual
            const productoSnap = await getDoc(productoRef);
            const productoActual = productoSnap.data();

            if (!productoActual) {
                console.error("El producto no existe.");
                return;
            }

            // Calcular nuevo precioTotal
            const nuevoPrecioTotal = nuevoProducto.precioTotal
                ? parseFloat(nuevoProducto.precioTotal) // Si existe, lo usamos
                : nuevoProducto.cantidad * nuevoProducto.precioUnitario; // Si no, lo calculamos

            // Actualizar producto en 'Ventas Panaderia'
            await updateDoc(productoRef, {
                nombre: nuevoProducto.nombre,
                cantidad: nuevoProducto.cantidad,
                precioUnitario: nuevoProducto.precioUnitario,
                precioTotal: nuevoPrecioTotal
            });

            // Asumiendo que tienes un campo `facturaId` en el producto
            const facturaId = productoActual.facturaId; // O el nombre del campo que almacena el ID de la factura
            if (facturaId) {
                const facturaRef = doc(db, 'Facturas Panaderia', facturaId); // Usa el ID de la factura
                await updateDoc(facturaRef, {
                    nombre: nuevoProducto.nombre,
                    cantidad: nuevoProducto.cantidad,
                    precioUnitario: nuevoProducto.precioUnitario,
                    precioTotal: nuevoPrecioTotal
                });
            } else {
                console.error("No se encontró el ID de la factura.");
            }

            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '' });
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
            precioTotal: producto.precioTotal
        });
        setProductoAActualizar(producto.id);
        setShowModal(true);
    };
    

    const generarFactura = async (producto) => {
        try {
            // Calcular precioTotal dependiendo de si ya hay un valor o no
            const precioTotal = producto.precioTotal
                ? parseFloat(producto.precioTotal) // Si existe, lo usamos
                : producto.cantidad * producto.precioUnitario; // Si no, lo calculamos

            const factura = {
                nombre: producto.nombre,
                cantidad: producto.cantidad,
                precioUnitario: producto.precioUnitario,
                precioTotal: precioTotal, // Usamos el valor calculado o el proporcionado
                fecha: new Date(),
            };
  
            // Preguntar al usuario si desea descargar la factura
            const confirmarDescarga = window.confirm("¿Deseas descargar la factura?");
            if (confirmarDescarga) {
                // Mostrar el PDF de la factura
                mostrarFactura(factura);
            }

            const docRef = await addDoc(collection(db, 'Facturas Panaderia'), factura);

            return docRef.id; // Retornar el ID de la factura
        } catch (error) {
            console.error("Error al generar factura: ", error);
        }
    };



    const descargarFactura = (producto) => {
        const factura = {
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precioUnitario: producto.precioUnitario,
            precioTotal: producto.precioTotal,
            // precioTotal: producto.cantidad * producto.precioUnitario,
            fecha: new Date().toISOString(),
        };
        mostrarFactura(factura);
    };


    const AñadirAlCarrito = () => {
        // Verifica que los campos no estén vacíos
        if (nuevoProducto.nombre && nuevoProducto.cantidad && nuevoProducto.precioUnitario) {
            añadirProductoAlCarrito(nuevoProducto);
            // Limpiar campos después de agregar
            setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', precioTotal: '' });
            setShowModal(false)
        } else {
            alert("Todos los campos son requeridos")
        }
    };







    return (
        <div>
            <Navbar />
            <button type="button" className="btn btn-primary m-2" onClick={() => {
                setShowModal(true);
                setNuevoProducto({ nombre: '', cantidad: '', precioUnitario: '', precioTotal: '' });
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
                                <label htmlFor="precio" className="form-label">Precio Total</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="PrecioTotal"
                                    value={nuevoProducto.precioTotal}
                                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, precioTotal: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={AñadirAlCarrito} >Agregar Mas Producto</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={() => productoAActualizar ? actualizarProducto(productoAActualizar) : agregarProducto()}>
                                {productoAActualizar ? 'Actualizar Producto' : 'Finalizar'}
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
                                    <td>${parseFloat(producto.precioUnitario)}</td>
                                    <td>${producto.precioTotal}</td>
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

export default Home;
