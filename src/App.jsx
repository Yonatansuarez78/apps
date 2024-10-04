import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida'
import Home from './pages/Home'; 
import Pasteleria from './pages/Pasteleria'


import Login from './pagesPrivate/Login'

import EstadoVentas from './privated/EstadoVentas'
import Sidebars from './privated/Sidebars'
import HomePrivated from './privated/HomePrivated'


function App() {
  return (
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
  );
}

export default App;
