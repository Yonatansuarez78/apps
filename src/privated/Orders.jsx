import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';  // Importar correctamente db de la configuración de Firebase
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; // Importar las funciones necesarias
import Sidebars from './Sidebars';

function Orders() {
    const [ventasPanaderia, setVentasPanaderia] = useState([]);
    const [ventasPasteleria, setVentasPasteleria] = useState([]);
    const [ventasPedido, setVentasPedido] = useState([]);
    const [ventasAlmuerzos, setVentasAlmuerzos] = useState([]);

    // Función para obtener los datos de Firebase
    const fetchData = async () => {
        try {
            // Ordenar los documentos por fecha (más recientes primero)
            const panaderiaQuery = query(collection(db, 'Ventas Panaderia'), orderBy('fecha', 'desc'));
            const pasteleriaQuery = query(collection(db, 'Ventas Pasteleria'), orderBy('fecha', 'desc'));
            const pedidoQuery = query(collection(db, 'Ventas Pedido'), orderBy('fecha', 'desc'));
            const almuerzosQuery = query(collection(db, 'Ventas Almuerzos'), orderBy('fecha', 'desc'));

            // Obtener los documentos de las colecciones con la consulta ordenada
            const panaderiaSnapshot = await getDocs(panaderiaQuery);
            const pasteleriaSnapshot = await getDocs(pasteleriaQuery);
            const pedidoSnapshot = await getDocs(pedidoQuery);
            const almuerzosSnapshot = await getDocs(almuerzosQuery);

            // Mapeamos los documentos de cada colección a su formato
            setVentasPanaderia(panaderiaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setVentasPasteleria(pasteleriaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setVentasPedido(pedidoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setVentasAlmuerzos(almuerzosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Llamar a fetchData cuando el componente se monte
    useEffect(() => {
        fetchData();
    }, []);

    // Funciones de acción (Actualizar, Eliminar, Imprimir)
    const handleUpdate = (id) => {
        console.log("Actualizar producto con id:", id);
        // Aquí puedes implementar la lógica de actualización
    };

    const handleDelete = (id) => {
        console.log("Eliminar producto con id:", id);
        // Lógica para eliminar el documento de Firestore
    };

    const handlePrint = () => {
        console.log("Imprimir");
        window.print(); // Esto abrirá el cuadro de diálogo para imprimir
    };

    const formatFechaYHora = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Convertir el Timestamp de Firestore a objeto Date
        // Formatear fecha y hora en el mismo string
        const fecha = date.toLocaleDateString('es-ES'); // Fecha en formato corto
        const hora = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }); // Hora en formato 12 horas
        return `${fecha} ${hora}`;
    };

    // Renderizar tabla
    const renderTable = (ventas) => {
        return (
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>Numero Pedido</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Precio Total</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td>{venta.id}</td>
                            <td>{venta.nombre}</td>
                            <td>{venta.precioUnitario}</td>
                            <td>{venta.cantidad}</td>
                            <td>{venta.precioTotal}</td>
                            <td>{formatFechaYHora(venta.fecha)}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleUpdate(venta.id)}>Actualizar</button>
                                <button className="btn btn-danger me-2" onClick={() => handleDelete(venta.id)}>Eliminar</button>
                                <button className="btn btn-info" onClick={handlePrint}>Imprimir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <div style={{ width: '280px' }}>
                <Sidebars />
            </div>
            <div className="flex-grow-1 p-3">
                <h2>Ventas</h2>
                <ul className="nav nav-tabs" id="tab-ventas" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" id="panaderia-tab" data-bs-toggle="tab" href="#panaderia" role="tab" aria-controls="panaderia" aria-selected="true"><p className='text-dark'>Ventas Panadería</p></a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link " id="pasteleria-tab" data-bs-toggle="tab" href="#pasteleria" role="tab" aria-controls="pasteleria" aria-selected="false"><p className='text-dark'>Ventas Pasteleria</p></a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="pedido-tab" data-bs-toggle="tab" href="#pedido" role="tab" aria-controls="pedido" aria-selected="false"><p className='text-dark'>Ventas Pedido</p></a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="almuerzos-tab" data-bs-toggle="tab" href="#almuerzos" role="tab" aria-controls="almuerzos" aria-selected="false"><p className='text-dark'>Ventas Almuerzos</p></a>
                    </li>
                </ul>

                <div className="tab-content" id="tab-ventas-content">
                    <div className="tab-pane fade show active" id="panaderia" role="tabpanel" aria-labelledby="panaderia-tab">
                        {renderTable(ventasPanaderia)}
                    </div>
                    <div className="tab-pane fade" id="pasteleria" role="tabpanel" aria-labelledby="pasteleria-tab">
                        {renderTable(ventasPasteleria)}
                    </div>
                    <div className="tab-pane fade" id="pedido" role="tabpanel" aria-labelledby="pedido-tab">
                        {renderTable(ventasPedido)}
                    </div>
                    <div className="tab-pane fade" id="almuerzos" role="tabpanel" aria-labelledby="almuerzos-tab">
                        {renderTable(ventasAlmuerzos)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Orders;
