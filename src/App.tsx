import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Home/>} />
    </Routes>
  </BrowserRouter>
);

export default App;