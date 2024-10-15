import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firestore
import '../styles/privated/estadoVentas.css';
import { format, subDays } from 'date-fns';
import { Spinner } from 'react-bootstrap';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const EstadoVentas = () => {
    const [panaderiaData, setPanaderiaData] = useState(null); // Datos del gráfico de Panadería
    const [pasteleriaData, setPasteleriaData] = useState(null); // Datos del gráfico de Pastelería
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // Obtener datos de Ventas Panadería
                const panaderiaSnapshot = await getDocs(collection(db, 'Ventas Panaderia'));
                const panaderiaSales = panaderiaSnapshot.docs.map(doc => doc.data());

                const salesByDayPanaderia = {};
                panaderiaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const day = format(saleDate, 'dd/MM/yyyy');
                    if (!salesByDayPanaderia[day]) {
                        salesByDayPanaderia[day] = 0;
                    }
                    salesByDayPanaderia[day] += sale.precioTotal;
                });

                const today = new Date();
                const last5Days = [];
                for (let i = 0; i < 5; i++) {
                    last5Days.push(format(subDays(today, i), 'dd/MM/yyyy'));
                }

                const filteredPanaderiaData = last5Days.reverse().reduce((acc, day) => {
                    acc[day] = salesByDayPanaderia[day] || 0;
                    return acc;
                }, {});

                setPanaderiaData({
                    labels: Object.keys(filteredPanaderiaData),
                    datasets: [
                        {
                            label: 'Ventas Panadería',
                            data: Object.values(filteredPanaderiaData),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                // Obtener datos de Ventas Pastelería
                const pasteleriaSnapshot = await getDocs(collection(db, 'Ventas Pasteleria'));
                const pasteleriaSales = pasteleriaSnapshot.docs.map(doc => doc.data());

                const salesByDayPasteleria = {};
                pasteleriaSales.forEach(sale => {
                    const saleDate = sale.fecha.toDate();
                    const day = format(saleDate, 'dd/MM/yyyy');
                    if (!salesByDayPasteleria[day]) {
                        salesByDayPasteleria[day] = 0;
                    }
                    salesByDayPasteleria[day] += sale.precioTotal;
                });

                const filteredPasteleriaData = last5Days.reduce((acc, day) => {
                    acc[day] = salesByDayPasteleria[day] || 0;
                    return acc;
                }, {});

                setPasteleriaData({
                    labels: Object.keys(filteredPasteleriaData),
                    datasets: [
                        {
                            label: 'Ventas Pastelería',
                            data: Object.values(filteredPasteleriaData),
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos');
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    // Memorizar los datos de los gráficos
    const panaderiaChart = useMemo(() => {
        if (loading) return (
            <div className="d-flex justify-content-center">
                <p>Cargando datos de Panadería...</p>
                <Spinner animation="border" role="status"> </Spinner>
            </div>
        );

        if (error) return <p>{error}</p>;
        if (panaderiaData) return <Bar data={panaderiaData} />;
        return null;
    }, [loading, error, panaderiaData]);

    const pasteleriaChart = useMemo(() => {
        if (loading) return (
            <div className="d-flex justify-content-center">
                <p>Cargando datos de Pastelería...</p>
                <Spinner animation="border" role="status"> </Spinner>
            </div>
        );

        if (error) return <p>{error}</p>;
        if (pasteleriaData) return <Bar data={pasteleriaData} />;
        return null;
    }, [loading, error, pasteleriaData]);

    return (
        <div className="container p-3">
            <div className="row">
                <div className="col-md-6">
                    <h3>Ventas Panadería</h3>
                    {panaderiaChart}
                </div>
                <div className="col-md-6">
                    <h3>Ventas Pastelería</h3>
                    {pasteleriaChart}
                </div>
            </div>
        </div>
    );
};

export default EstadoVentas;
