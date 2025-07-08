import { Routes, Route } from 'react-router-dom';
import RecipePage from './pages/RecipePage';
import ReviewsPage from './pages/ReviewsPage';
import Navbar from './components/Navbar';

import "./styles/app.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </>
  );
}

export default App;
