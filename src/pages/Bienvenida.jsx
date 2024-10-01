import React from 'react';
import { Link } from 'react-router-dom';

function Bienvenida() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="display-4">Hola, Bienvenido</h1>
            <Link to="/Home" className="btn btn-primary mt-3">
                Comenzar
            </Link>
        </div>
    );
}

export default Bienvenida;
