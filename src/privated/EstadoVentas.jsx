import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import '../styles/privated/estadoVentas.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const EstadoVentas = () => {
    const barData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [
            {
                label: 'Ventas en USD',
                data: [90, 50, 30, 80, 100],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Ventas', 'Gastos', 'Ahorros'],
        datasets: [
            {
                label: 'Distribución Financiera',
                data: [50, 30, 20],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [
            {
                label: 'Crecimiento de Ventas',
                data: [12000, 19000, 3000, 5000, 20000],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="container p-3">
            <div className="row">
                <div className="col-md-6">
                    <Bar data={barData} />
                    <hr />
                    <Line data={lineData} />
                </div>
                <div className="col-md-6">
                    <Doughnut data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default EstadoVentas;
