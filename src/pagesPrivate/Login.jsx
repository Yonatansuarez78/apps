import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app); // Inicializa el servicio de autenticación

  const GoLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      alert("Inicio de sesión exitoso");
      // Redirige o realiza otra acción tras el inicio de sesión
    } catch (error) {
      alert(error.message); // Muestra el error si ocurre
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
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
          <div className="mt-3 text-center">
            <a href="/Home">Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
