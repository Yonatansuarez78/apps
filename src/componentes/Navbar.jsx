import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/privated/navbar.css';

function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/Home">PatrosPan</a>
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
                                <NavLink to="/Home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} >
                                    Panadería
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink  to="/Pasteleria"  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} >
                                    Pastelería
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/Almuerzos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                                    Almuerzos
                                </NavLink>
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
