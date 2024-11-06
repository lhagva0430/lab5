import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PlacesList = ({ userId }) => {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch places for the user from the API
  useEffect(() => {
    fetch(`/api/places/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.places) {
          setPlaces(data.places);
        } else {
          setError('Алдаа гарлаа!'); // Error fetching places
        }
      })
      .catch(() => setError('Алдаа гарлаа!')); // Handle fetch errors
  }, [userId]);

  // Add new place via API
  const addPlace = () => {
    if (newPlace.trim()) {
      const newPlaceData = {
        title: newPlace,
        description: '',  // Empty description for now
        address: '',      // Empty address for now
        image: ''         // No image for now
      };

      fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlaceData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.place) {
            setPlaces([...places, data.place]); // Add the new place to the list
            setNewPlace(""); // Clear the input field
          } else {
            setError('Алдаа гарлаа!'); // Error adding place
          }
        })
        .catch(() => setError('Алдаа гарлаа!')); // Handle network errors
    }
  };

  // Remove place via API
  const removePlace = (pid) => {
    fetch(`/api/places/${pid}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        setPlaces(places.filter(place => place.id !== pid)); // Remove place from list
      })
      .catch(() => setError('Алдаа гарлаа!')); // Handle network errors
  };

  return (
    <div>
      <h2>Газрын жагсаалт</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error if any */}
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            {place.title} {/* Display the place title */}
            <button onClick={() => removePlace(place.id)}>Устгах</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Газрын нэр"
        value={newPlace}
        onChange={(e) => setNewPlace(e.target.value)}
      />
      <button onClick={addPlace}>Газар нэмэх</button>
    </div>
  );
};

export default PlacesList;
