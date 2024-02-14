import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // Ensure this path is correct
import NotFound from "./components/layout/NotFound";
import HomePage from './pages/HomePage';
import VenuePage from './pages/VenuePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} /> {/* HomePage now fetches its data */}
                    <Route path="venue/:id" element={<VenuePage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
