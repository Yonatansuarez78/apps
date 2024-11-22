import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';  // Importar useLocation
import { signOut, getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/privated/Sidebars.css'

function Sidebars() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const location = useLocation(); // Hook que nos da la ruta actual

    const [userImage, setUserImage] = useState(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Sesión cerrada");
            navigate('/Home');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserImage(user.photoURL);
        } else {
            setUserData(null);
        }
    }, []);

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px', height: '100vh' }}>
            <Link to="/Home" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Patros Pan</span>
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className={`nav-item ${location.pathname === '/HomePrivated' ? 'active' : ''}`}>
                    <Link to="/HomePrivated" className="nav-link text-white">
                        Estado Ventas
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/Orders' ? 'active' : ''}`}>
                    <Link to="/Orders" className="nav-link text-white">
                        Ordenes
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                    <Link to="/orders" className="nav-link text-white">
                        Or
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
                    <Link to="/products" className="nav-link text-white">
                        Products
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/customers' ? 'active' : ''}`}>
                    <Link to="/customers" className="nav-link text-white">
                        Customers
                    </Link>
                </li>
            </ul>
            <hr />
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={userImage ? userImage : 'https://via.placeholder.com/150'} alt="" width="32" height="32" className="rounded-circle me-2" />
                    <strong>Opciones</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <Link to="/Perfil" className="dropdown-item">Perfil</Link>
                    <li><hr className="dropdown-divider" /></li>
                    <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                </ul>
            </div>
        </div>
    );
}

export default Sidebars;
