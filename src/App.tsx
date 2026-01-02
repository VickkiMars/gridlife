import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Integrations from './pages/Integrations';
import Methods from './pages/Methods';
import Squads from './pages/Squads';
import SquadDetail from './pages/SquadDetail';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Home/>} />
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/methodica" element={<Methods/>}/>
      <Route path="/integrations" element={<Integrations/>}/>
      <Route path="/squads" element={<Squads/>}/>
      <Route path="/squads/:squadId" element={<SquadDetail />} />
    </Routes>
  </BrowserRouter>
);

export default App;
