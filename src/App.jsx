import { Routes, Route, Link } from 'react-router-dom';
import RecipesPage from './pages/RecipePage';
import ReviewsPage from './pages/ReviewsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
      
    </div>
  );
}

export default App;
