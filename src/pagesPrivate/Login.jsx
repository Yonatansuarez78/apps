import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    // Observa los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Usuario autenticado
        navigate('/HomePrivated'); // Redirige al área privada si está autenticado
      } else {
        setUser(null); // No hay usuario autenticado
      }
    });

    return () => unsubscribe(); // Limpia el observador cuando se desmonte el componente
  }, [auth, navigate]);

  const GoLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {user ? (
            <div className="text-center">
              <p>Estás autenticado como: {user.email}</p>
              <button onClick={handleLogout} className="btn btn-secondary w-100">Cerrar Sesión</button>
            </div>
          ) : (
            <form onSubmit={GoLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="Introduce tu email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
            </form>
          )}
          <div className="mt-3 text-center">
            <a href="/Home">Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
