import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/Home">Patros</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/Home">Panaderia</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/Pasteleria">Pasteleria</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Almuerzos</a>
                            </li>
                        </ul>
                        <Link to="/Login" className="btn btn-primary">Iniciar Sesión</Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
