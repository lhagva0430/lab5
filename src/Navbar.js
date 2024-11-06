// Navbar Component
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userId }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/authenticate">Authenticate</Link>
        </li>
        <li>
          <Link to={`/places/new/${userId}`}>Add Place</Link>
        </li>
        <li>
          <Link to={`/${userId}/places`}>User Places</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
