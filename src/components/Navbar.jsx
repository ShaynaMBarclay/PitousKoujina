import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        <FaUtensils className="nav-icon" />
      </Link>
      <Link to="/reviews" className="nav-link">
         <FiGlobe className="nav-icon" />
      </Link>
    </nav>
  );
}

export default Navbar;
