import React from 'react'
import { Link } from 'react-router-dom';

function NotFound() {
  return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-4 p-2">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/Home">volver al inicio</Link>
      </div>
  )
}

export default NotFound
