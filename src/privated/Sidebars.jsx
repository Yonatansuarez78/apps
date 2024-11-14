import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/privated/sidebars.css';
import { signOut, getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Sidebars() {
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Sesión cerrada");
            navigate('/Home'); // Redirige al usuario al inicio o a otra ruta de tu preferencia
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };


    return (
        <div>
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px', height: '100vh' }}>
                <Link to="/Home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="bi pe-none me-2" width="40" height="32"><use xlinkHref="#bootstrap" /></svg>
                    <span className="fs-4">Patros Pan</span>
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/HomePrivated" className="nav-link active" aria-current="page">
                            <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#home" /></svg>
                            Estado Ventas
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#speedometer2" /></svg>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/orders" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#table" /></svg>
                            Orders
                        </Link>
                    </li>
                    <li>
                        <Link to="/products" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#grid" /></svg>
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link to="/customers" className="nav-link text-white">
                            <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#people-circle" /></svg>
                            Customers
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                        <strong>mdo</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="dropdown-item" onClick={() => { handleLogout(); }}>Sign out</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebars;
