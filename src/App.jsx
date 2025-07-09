import { Routes, Route } from 'react-router-dom';
import ReviewsPage from './pages/ReviewsPage';
import RecipePage from './pages/RecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import Navbar from './components/Navbar';
import AdminWrapper from "./components/AdminWrapper";
import AdminReviewWrapper from './components/AdminReviewWrapper';

import "./styles/app.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipePage isAdmin={false} />} />
        <Route path="/reviews" element={<ReviewsPage isAdmin={false} />} />
        <Route path="/reviews/:id" element={<ReviewDetailPage />} />
        <Route path="/reviews/admin" element={<AdminReviewWrapper />} />
        <Route path="/admin" element={<AdminWrapper />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
