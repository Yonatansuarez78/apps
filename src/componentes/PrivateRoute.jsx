import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';

const PrivateRoute = ({ element, ...rest }) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    // Si no está autenticado, redirige al login
    return user ? element : <Navigate to="/Login" replace />;
};

export default PrivateRoute;
