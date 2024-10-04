import React from 'react';
import Sidebars from './Sidebars';
import EstadoVentas from './EstadoVentas';
import '../styles/privated/homePrivated.css'; // Asegúrate de tener este archivo CSS

function HomePrivated() {
    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <div style={{ width: '280px' }}>
                <Sidebars />
            </div>
            <div className="flex-grow-1">
                <EstadoVentas />
            </div>
        </div>
    );
}

export default HomePrivated;
