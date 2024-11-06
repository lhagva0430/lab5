import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Authenticate from './Authenticate.js';
import UserPlaces from './UserPlace.js';
import AddPlace from './AddPlace';
import EditPlace from './EditPlace.js';
import Home from './Home.js';
import NavBar from './Navbar.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
   
    const token = localStorage.getItem('token'); 
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <NavBar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authenticate" element={isLoggedIn ? <Navigate to="/" /> : <Authenticate setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/places/new/:uid" element={isLoggedIn ? <AddPlace /> : <Navigate to="/authenticate" />} />
        <Route path="/places/:pid/edit" element={isLoggedIn ? <EditPlace /> : <Navigate to="/authenticate" />} />
        <Route path="/:uid/places" element={isLoggedIn ? <UserPlaces /> : <Navigate to="/authenticate" />} />
      </Routes>
    </Router>
  );
}

export default App;


