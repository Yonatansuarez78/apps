import React, { useState, useEffect } from 'react';
import Navbar from '../componentes/Navbar';

import { collection, addDoc, updateDoc, doc, Timestamp, query, orderBy, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Asegúrate de haber inicializado Firebase y Firestore

function Almuerzos() {
    const [showModal, setShowModal] = useState(false);
    const [numAlmuerzos, setNumAlmuerzos] = useState(1);
    const [almuerzos, setAlmuerzos] = useState([{ sopa: '', principio: '', carne: '', arroz: true, limonada: '', otros: '', precio: 0 }]);

    const [pedidos, setPedidos] = useState([]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    

    const handleNumAlmuerzosChange = (e) => {
        const value = e.target.value;

        // Permitir que el input sea vacío temporalmente
        if (value === '' || parseInt(value) < 0) {
            setNumAlmuerzos(value);
            return;
        }
        const newCount = parseInt(value);
        setNumAlmuerzos(newCount);
        setAlmuerzos(prevAlmuerzos =>
            newCount > prevAlmuerzos.length
                ? [...prevAlmuerzos, ...Array(newCount - prevAlmuerzos.length).fill({
                    sopa: '', principio: '', carne: '', arroz: true, limonada: '', otros: '', precio: 0
                })]
                : prevAlmuerzos.slice(0, newCount)
        );
    };



    const handleCheckboxChange = (index, field) => {
        const updatedAlmuerzos = [...almuerzos];
        updatedAlmuerzos[index][field] = !updatedAlmuerzos[index][field];
        setAlmuerzos(updatedAlmuerzos);
    };

    const handleInputChange = (index, field, value) => {
        const updatedAlmuerzos = [...almuerzos];
        updatedAlmuerzos[index][field] = value;
        setAlmuerzos(updatedAlmuerzos);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        agregarProducto()
        setNumAlmuerzos(1);
        setAlmuerzos([{ sopa: '', principio: '', carne: '', arroz: true, limonada: '', otros: '', precio: 0 }]);
        handleCloseModal();
    };

    async function agregarProducto() {
        const confirmacion = window.confirm("¿Estás seguro de que deseas realizar este pedido?");
        if (confirmacion) {
            try {
                const pedidoData = {
                    almuerzos: almuerzos, // Incluye todos los almuerzos seleccionados
                    fecha: new Date(),
                    total: calcularTotal(), // Total del pedido
                };
                const docRefPedido = await addDoc(collection(db, "Ventas Almuerzos"), pedidoData);


                const facturaData = {
                    pedidoId: docRefPedido.id, // ID del pedido creado
                    fecha: new Date(),
                    almuerzos: almuerzos, // Incluye todos los almuerzos seleccionados
                    total: calcularTotal() // Mismo total del pedido
                };
                const docRefFactura = await addDoc(collection(db, "Facturas Almuerzos"), facturaData);

                // 3. Actualizamos el pedido con el ID de la factura
                const pedidoDocRef = doc(db, "Ventas Almuerzos", docRefPedido.id);
                await updateDoc(pedidoDocRef, {
                    facturaId: docRefFactura.id // ID de la factura en el pedido
                });

                // 4. Actualizamos la factura con el ID del pedido
                const facturaDocRef = doc(db, "Facturas Almuerzos", docRefFactura.id);
                await updateDoc(facturaDocRef, {
                    pedidoId: docRefPedido.id // ID del pedido en la factura
                });

                console.log("Pedido y factura guardados con éxito");
                await fetchPedidos(); 
            } catch (error) {
                console.error("Error guardando los datos: ", error);
            }
        } else {
            console.log("Eliminación cancelada.");
        }
    }

    function calcularTotal() {
        return almuerzos.reduce((total, almuerzo) => {
            return total + parseFloat(almuerzo.precio || 0); // Suma el precio de cada almuerzo
        }, 0);
    }

    const fetchPedidos = async () => {
        try {
            const q = query(collection(db, "Ventas Almuerzos"), orderBy("fecha", "desc"));
            const querySnapshot = await getDocs(q);
            const pedidosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPedidos(pedidosData);
        } catch (error) {
            console.error("Error al obtener los pedidos: ", error);
        }
    };
    useEffect(() => {
        fetchPedidos();
    }, []);


    
    const descargarFactura = (pedido) => {
        alert(`Descargando factura del pedido: ${pedido.id}`);
    };

    const eliminarPedido = async (pedidoId) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este pedido?");
        if (!confirmacion) return;

        try {
            const pedidoDocRef = doc(db, "Ventas Almuerzos", pedidoId);
            const pedidoSnapshot = await getDoc(pedidoDocRef);
            if (pedidoSnapshot.exists()) {
                const pedidoData = pedidoSnapshot.data();
                const facturaId = pedidoData.facturaId; // ID de la factura asociada
                await deleteDoc(pedidoDocRef);
                if (facturaId) {
                    const facturaDocRef = doc(db, "Facturas Almuerzos", facturaId);
                    await deleteDoc(facturaDocRef);
                }
                setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
            } else {
                alert("El pedido no existe o ya ha sido eliminado");
            }
        } catch (error) {
            alert("Hubo un error al intentar eliminar el pedido");
        }
    };

    const ActualizarPedido = (pedido) => {
        alert(`Actualizando el pedido pedido: ${pedido.id}`);
    };


    return (
        <div>
            <Navbar />
            <button type="button" className="btn btn-primary m-2" onClick={handleOpenModal}>
                Agregar Almuerzo
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} aria-modal="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agregar Almuerzo</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="numAlmuerzos" className="form-label">Cantidad de Almuerzos:</label>
                                        <input
                                            type="number"
                                            id="numAlmuerzos"
                                            value={numAlmuerzos}
                                            onChange={handleNumAlmuerzosChange}
                                            min="1"
                                            className="form-control"
                                        />
                                    </div>

                                    {/* Campos para cada almuerzo */}
                                    {almuerzos.map((almuerzo, index) => (
                                        <div key={index} className="mb-3 border p-3 rounded">
                                            <h6>Almuerzo {index + 1}</h6>

                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={almuerzo.arroz}
                                                    onChange={() => handleCheckboxChange(index, 'arroz')}
                                                />
                                                <label className="form-check-label">Arroz</label>
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={almuerzo.sopa}
                                                    placeholder='Sopa'
                                                    onChange={(e) => handleInputChange(index, 'sopa', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={almuerzo.principio}
                                                    placeholder='Principio'
                                                    onChange={(e) => handleInputChange(index, 'principio', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={almuerzo.carne}
                                                    placeholder='Carne'
                                                    onChange={(e) => handleInputChange(index, 'carne', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={almuerzo.limonada}
                                                    placeholder='Limonada'
                                                    onChange={(e) => handleInputChange(index, 'limonada', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <label className="form-label">Otros:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={almuerzo.otros}
                                                    onChange={(e) => handleInputChange(index, 'otros', e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-2">
                                                <label className="form-label">Precio del Almuerzo:</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={almuerzo.precio}
                                                    placeholder='Precio'
                                                    onChange={(e) => handleInputChange(index, 'precio', e.target.value)}
                                                />
                                            </div>



                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Agregar Almuerzo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            <div className="container mt-3">
                {pedidos.length === 0 ? (
                    <p className="text-center">No hay pedidos agregados</p>
                ) : (
                    pedidos.map((pedido) => (
                        <div className="border-bottom py-2" key={pedido.id}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">
                                    {new Date(pedido.fecha.seconds * 1000).toLocaleDateString()} {new Date(pedido.fecha.seconds * 1000).toLocaleTimeString("es-ES", { hour: 'numeric', minute: 'numeric', hour12: true })}
                                </span>
                                <span className="fw-bold">${pedido.total}</span>
                            </div>

                            {pedido.almuerzos.map((almuerzo, index) => (
                                <div key={index} className="small text-muted">
                                    <span> * {almuerzo.sopa}, {almuerzo.principio}, {almuerzo.carne}</span>
                                    <span>{almuerzo.arroz ? ", Arroz" : ""}</span>
                                    <span>{almuerzo.limonada ? ", Limonada" : ""}</span>
                                    <span>{almuerzo.otros && `, Otros: ${almuerzo.otros}`}</span>
                                    <span className="d-block">Precio: ${almuerzo.precio}</span>
                                </div>
                            ))}

                            <div className="d-flex justify-content-end mt-1">
                                <button className="btn btn-warning btn-sm me-1" onClick={() => ActualizarPedido(pedido)}>Actualizar</button>
                                <button className="btn btn-info btn-sm me-1" onClick={() => descargarFactura(pedido)}>Imprimir</button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarPedido(pedido.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>


        </div>
    );
}

export default Almuerzos;
