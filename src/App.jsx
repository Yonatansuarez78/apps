import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
import Home from './pages/Home';
import Pasteleria from './pages/Pasteleria';
import Almuerzos from './pages/Almuerzos';

import Login from './pages/Login';
import NotFound from './pages/NotFound';

import EstadoVentas from './privated/EstadoVentas';
import Sidebars from './privated/Sidebars';
import HomePrivated from './privated/HomePrivated';
import Orders from './privated/Orders';
import Perfil from './privated/Perfil';

import { CarritoProvider } from './context/CarritoContext';
import PrivateRoute from './utils/PrivateRoute';  // Importar el componente PrivateRoute

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Pasteleria" element={<Pasteleria />} />
          <Route path="/Almuerzos" element={<Almuerzos />} />
          <Route path="/Login" element={<Login />} />

          {/* Rutas privadas protegidas */}
          <Route path="/Sidebars" element={<PrivateRoute element={<Sidebars />} />} />
          <Route path="/EstadoVentas" element={<PrivateRoute element={<EstadoVentas />} />} />
          <Route path="/HomePrivated" element={<PrivateRoute element={<HomePrivated />} />} />
          <Route path="/Orders" element={<PrivateRoute element={<Orders />} />} />
          <Route path="/Perfil" element={<PrivateRoute element={<Perfil />} />} />

          

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;
