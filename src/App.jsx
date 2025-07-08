import { Routes, Route } from 'react-router-dom';
import ReviewsPage from './pages/ReviewsPage';
import RecipePage from './pages/RecipePage';
import Navbar from './components/Navbar';
import AdminWrapper from "./components/AdminWrapper";

import "./styles/app.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipePage isAdmin={false} />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/admin" element={<AdminWrapper />} />
      </Routes>
    </>
  );
}

export default App;
