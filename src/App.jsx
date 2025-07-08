import { Routes, Route } from 'react-router-dom';
import RecipesPage from './pages/RecipePage';
import ReviewsPage from './pages/ReviewsPage';
import Navbar from './components/Navbar';
import "./styles/app.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </>
  );
}

export default App;
