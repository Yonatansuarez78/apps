import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida'
import Home from './pages/Home'; 
import Pasteleria from './pages/Pasteleria'


import Login from './pagesPrivate/Login'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Pasteleria" element={<Pasteleria />} />

        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
