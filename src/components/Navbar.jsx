import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';

function Navbar() {
   const [searchTerm, setSearchTerm] = useState("");
   const navigate = useNavigate();

    const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        <FaUtensils className="nav-icon" />
      </Link>
      <Link to="/reviews" className="nav-link">
         <FiGlobe className="nav-icon" />
      </Link>

        <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes or reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">🔍</button>
      </form>
      
    </nav>
  );
}

export default Navbar;
