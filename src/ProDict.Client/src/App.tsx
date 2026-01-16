import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const TermDetailPage = lazy(() => import('./pages/TermDetailPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms/:id" element={<TermDetailPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App
