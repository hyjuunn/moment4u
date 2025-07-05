import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CreateDiaryPage from './pages/CreateDiaryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<CreateDiaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
