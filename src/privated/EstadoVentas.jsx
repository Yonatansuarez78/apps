import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { Spinner } from 'react-bootstrap';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EstadoVentas = () => {
    const [panaderiaData, setPanaderiaData] = useState(null);
    const [pasteleriaData, setPasteleriaData] = useState(null);
    const [almuerzosData, setAlmuerzosData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('last5days');  // Estado para el filtro

    const dateRanges = {
        last5days: (today) => Array.from({ length: 5 }, (_, i) => format(subDays(today, i), 'dd/MM/yyyy')),
        last5weeks: (today) => Array.from({ length: 5 }, (_, i) => format(subWeeks(today, i), 'dd/MM/yyyy')),
        last5months: (today) => Array.from({ length: 5 }, (_, i) => format(subMonths(today, i), 'MM/yyyy')),
        last5years: (today) => Array.from({ length: 5 }, (_, i) => format(subYears(today, i), 'yyyy')),
    };

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const today = new Date();
                const lastNDays = dateRanges[filter](today);  // Filtrado según la opción seleccionada

                // Obtener datos de Ventas Panadería
                const panaderiaSnapshot = await getDocs(collection(db, 'Ventas Panaderia'));
                const panaderiaSales = panaderiaSnapshot.docs.map(doc => doc.data());

                const salesByPeriodPanaderia = {};
                panaderiaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const period = format(saleDate, filter === 'last5months' ? 'MM/yyyy' : filter === 'last5years' ? 'yyyy' : 'dd/MM/yyyy');
                    if (!salesByPeriodPanaderia[period]) salesByPeriodPanaderia[period] = 0;
                    salesByPeriodPanaderia[period] += sale.precioTotal;
                });

                const filteredPanaderiaData = lastNDays.reduce((acc, period) => {
                    acc[period] = salesByPeriodPanaderia[period] || 0;
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

                const salesByPeriodPasteleria = {};
                pasteleriaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const period = format(saleDate, filter === 'last5months' ? 'MM/yyyy' : filter === 'last5years' ? 'yyyy' : 'dd/MM/yyyy');
                    if (!salesByPeriodPasteleria[period]) salesByPeriodPasteleria[period] = 0;
                    salesByPeriodPasteleria[period] += sale.precioTotal;
                });

                const filteredPasteleriaData = lastNDays.reduce((acc, period) => {
                    acc[period] = salesByPeriodPasteleria[period] || 0;
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

                const salesByPeriodAlmuerzos = {};
                almuerzosSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const period = format(saleDate, filter === 'last5months' ? 'MM/yyyy' : filter === 'last5years' ? 'yyyy' : 'dd/MM/yyyy');
                    if (!salesByPeriodAlmuerzos[period]) salesByPeriodAlmuerzos[period] = 0;
                    salesByPeriodAlmuerzos[period] += sale.total;
                });

                const filteredAlmuerzosData = lastNDays.reduce((acc, period) => {
                    acc[period] = salesByPeriodAlmuerzos[period] || 0;
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
    }, [filter]);  // Ejecuta el fetch cada vez que cambia el filtro

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
                <div className="col-12">
                    <select
                        className="form-select mb-3"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}>
                        <option value="last5days">Últimos 5 días</option>
                        <option value="last5weeks">Últimas 5 semanas</option>
                        <option value="last5months">Últimos 5 meses</option>
                        <option value="last5years">Últimos 5 años</option>
                    </select>
                </div>
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
