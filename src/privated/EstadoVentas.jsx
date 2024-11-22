import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { Spinner } from 'react-bootstrap';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EstadoVentas = () => {
    const [salesData, setSalesData] = useState({
        panaderia: null,
        pasteleria: null,
        almuerzos: null,
        pedido: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('last5days');

    const dateRanges = {
        last5days: (today) => Array.from({ length: 5 }, (_, i) => format(subDays(today, i), 'dd/MM/yyyy')),
        last5weeks: (today) => Array.from({ length: 5 }, (_, i) => format(subWeeks(today, i), 'dd/MM/yyyy')),
        last5months: (today) => Array.from({ length: 5 }, (_, i) => format(subMonths(today, i), 'MM/yyyy')),
        last5years: (today) => Array.from({ length: 5 }, (_, i) => format(subYears(today, i), 'yyyy')),
    };

    const fetchSalesData = async () => {
        try {
            const today = new Date();
            const lastNDays = dateRanges[filter](today);
            const collections = ['Ventas Panaderia', 'Ventas Pasteleria', 'Ventas Almuerzos', 'Ventas Pedido'];
            const salesPromises = collections.map((collectionName) => getDocs(collection(db, collectionName)));

            // Esperamos todas las promesas de las colecciones de ventas
            const snapshots = await Promise.all(salesPromises);

            const processSalesData = (sales, collectionName) => {
                const salesByPeriod = {};
                sales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const period = format(saleDate, filter === 'last5months' ? 'MM/yyyy' : filter === 'last5years' ? 'yyyy' : 'dd/MM/yyyy');
                    if (!salesByPeriod[period]) salesByPeriod[period] = 0;

                    let totalSale = 0;
                    if (collectionName === 'Ventas Pedido') {
                        // Iterar sobre cada item en el carrito para sumar el precioTotal
                        sale.carrito.forEach(item => {
                            totalSale += parseFloat(item.precioTotal);
                        });
                    } else {
                        totalSale = sale.precioTotal || sale.total || 0;
                    }

                    salesByPeriod[period] += totalSale;
                });

                return lastNDays.reduce((acc, period) => {
                    acc[period] = salesByPeriod[period] || 0;
                    return acc;
                }, {});
            };

            const salesDataProcessed = {};
            collections.forEach((collectionName, index) => {
                const sales = snapshots[index].docs.map(doc => doc.data());
                salesDataProcessed[collectionName] = processSalesData(sales, collectionName);
            });

            setSalesData({
                panaderia: salesDataProcessed['Ventas Panaderia'],
                pasteleria: salesDataProcessed['Ventas Pasteleria'],
                almuerzos: salesDataProcessed['Ventas Almuerzos'],
                pedido: salesDataProcessed['Ventas Pedido'],
            });
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los datos');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [filter]);

    const renderChart = (data, label) => (
        loading ? (
            <div className="d-flex justify-content-center">
                <p>Cargando datos de {label}...</p>
                <Spinner animation="border" role="status"> </Spinner>
            </div>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <Bar data={{
                labels: Object.keys(data),
                datasets: [{
                    label: label,
                    data: Object.values(data),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            }} options={{ responsive: true, maintainAspectRatio: false }} />
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
                {['panaderia', 'pasteleria', 'almuerzos', 'pedido'].map((category) => (
                    <div key={category} className="col-12 col-md-6">
                        <h5>{`Ventas ${category.charAt(0).toUpperCase() + category.slice(1)}`}</h5>
                        <div className="chart-container" style={{ height: '250px' }}>
                            {renderChart(salesData[category], `Ventas ${category.charAt(0).toUpperCase() + category.slice(1)}`)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EstadoVentas;
