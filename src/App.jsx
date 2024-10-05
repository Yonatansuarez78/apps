import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida'
import Home from './pages/Home'; 
import Pasteleria from './pages/Pasteleria'


import Login from './pagesPrivate/Login'

import EstadoVentas from './privated/EstadoVentas'
import Sidebars from './privated/Sidebars'
import HomePrivated from './privated/HomePrivated'

import { CarritoProvider } from './context/CarritoContext';


function App() {
  return (

    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Pasteleria" element={<Pasteleria />} />

          <Route path="/Login" element={<Login />} />

          <Route path="Sidebars" element={<Sidebars />} />
          <Route path="EstadoVentas" element={<EstadoVentas />} />
          <Route path="HomePrivated" element={<HomePrivated />} />

        </Routes>
      </BrowserRouter>
    </CarritoProvider>

  );
}

export default App;
