import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { format, subDays } from 'date-fns';
import { Spinner } from 'react-bootstrap';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EstadoVentas = () => {
    const [panaderiaData, setPanaderiaData] = useState(null);
    const [pasteleriaData, setPasteleriaData] = useState(null);
    const [almuerzosData, setAlmuerzosData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const today = new Date();
                const last5Days = [];
                for (let i = 0; i < 5; i++) {
                    last5Days.push(format(subDays(today, i), 'dd/MM/yyyy'));
                }

                // Obtener datos de Ventas Panadería
                const panaderiaSnapshot = await getDocs(collection(db, 'Ventas Panaderia'));
                const panaderiaSales = panaderiaSnapshot.docs.map(doc => doc.data());

                const salesByDayPanaderia = {};
                panaderiaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const day = format(saleDate, 'dd/MM/yyyy');
                    if (!salesByDayPanaderia[day]) salesByDayPanaderia[day] = 0;
                    salesByDayPanaderia[day] += sale.precioTotal;
                });

                const filteredPanaderiaData = last5Days.reverse().reduce((acc, day) => {
                    acc[day] = salesByDayPanaderia[day] || 0;
                    return acc;
                }, {});

                setPanaderiaData({
                    labels: Object.keys(filteredPanaderiaData),
                    datasets: [{
                        label: 'Ventas Panadería',
                        data: Object.values(filteredPanaderiaData),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                });

                // Obtener datos de Ventas Pastelería
                const pasteleriaSnapshot = await getDocs(collection(db, 'Ventas Pasteleria'));
                const pasteleriaSales = pasteleriaSnapshot.docs.map(doc => doc.data());

                const salesByDayPasteleria = {};
                pasteleriaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const day = format(saleDate, 'dd/MM/yyyy');
                    if (!salesByDayPasteleria[day]) salesByDayPasteleria[day] = 0;
                    salesByDayPasteleria[day] += sale.precioTotal;
                });

                const filteredPasteleriaData = last5Days.reduce((acc, day) => {
                    acc[day] = salesByDayPasteleria[day] || 0;
                    return acc;
                }, {});

                setPasteleriaData({
                    labels: Object.keys(filteredPasteleriaData),
                    datasets: [{
                        label: 'Ventas Pastelería',
                        data: Object.values(filteredPasteleriaData),
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                    }],
                });

                // Obtener datos de Ventas Almuerzos
                const almuerzosSnapshot = await getDocs(collection(db, 'Ventas Almuerzos'));
                const almuerzosSales = almuerzosSnapshot.docs.map(doc => doc.data());

                const salesByDayAlmuerzos = {};
                almuerzosSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const day = format(saleDate, 'dd/MM/yyyy');
                    if (!salesByDayAlmuerzos[day]) salesByDayAlmuerzos[day] = 0;
                    salesByDayAlmuerzos[day] += sale.total;
                });

                const filteredAlmuerzosData = last5Days.reduce((acc, day) => {
                    acc[day] = salesByDayAlmuerzos[day] || 0;
                    return acc;
                }, {});

                setAlmuerzosData({
                    labels: Object.keys(filteredAlmuerzosData),
                    datasets: [{
                        label: 'Ventas Almuerzos',
                        data: Object.values(filteredAlmuerzosData),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    }],
                });

                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos');
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const renderChart = (data, label) => (
        loading ? (
            <div className="d-flex justify-content-center">
                <p>Cargando datos de {label}...</p>
                <Spinner animation="border" role="status"> </Spinner>
            </div>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        )
    );

    return (
        <div className="container p-3">
            <div className="row">
                <div className="col-12 col-md-6">
                    <h5>Ventas Panadería</h5>
                    <div className="chart-container" style={{ height: '250px' }}>
                        {renderChart(panaderiaData, 'Panadería')}
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <h5>Ventas Pastelería</h5>
                    <div className="chart-container" style={{ height: '250px' }}>
                        {renderChart(pasteleriaData, 'Pastelería')}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <h5>Ventas Almuerzos</h5>
                    <div className="chart-container" style={{ height: '250px' }}>
                        {renderChart(almuerzosData, 'Almuerzos')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadoVentas;
