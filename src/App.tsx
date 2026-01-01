import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';


const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Home/>} />
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/signup" element={<Signup/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;