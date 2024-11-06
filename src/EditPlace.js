import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ComponentStyle.css';

const EditPlace = () => {
  const { pid } = useParams(); // Get the place ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null); // State to hold the image
  const [error, setError] = useState(''); // State to hold error messages

  useEffect(() => {
    // Fetch the place data from the API based on the place ID (pid)
    fetch(`/api/places/${pid}`)
      .then(response => response.json())
      .then(data => {
        if (data.place) {
          setTitle(data.place.title);
          setDescription(data.place.description);
          setAddress(data.place.address);
          setImage(data.place.image); // Set existing image
        } else {
          setError('Газар олдсонгүй!'); // Set error message if place is not found
        }
      })
      .catch(() => setError('Алдаа гарлаа!')); // Handle API error
  }, [pid]);

  const handleUpdatePlace = (e) => {
    e.preventDefault();

    const updatedPlace = {
      title,
      description,
      address,
      image
    };

    // Send a PATCH request to update the place by ID
    fetch(`/api/places/${pid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPlace),
    })
      .then(response => response.json())
      .then(data => {
        if (data.place) {
          navigate(`/places/user/${data.place.userId}`); // Redirect to the user's places page
        } else {
          setError('Алдаа гарлаа!'); // Show error message if update fails
        }
      })
      .catch(() => setError('Алдаа гарлаа!')); // Handle network errors
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image state to the file's data URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-container">
      <h2>Газар өөрчлөх</h2>
      {error && <p className="error-message">{error}</p>} {/* Show error message if exists */}
      <form onSubmit={handleUpdatePlace}>
        <input
          type="text"
          placeholder="Гарчиг"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Байршил"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <textarea
          placeholder="Тайлбар"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        
        {/* Image Upload Section */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {image && <img src={image} alt="Preview" className="image-preview" />} {/* Show image preview */}

        <button type="submit" className="btn">Хадгалах</button>
      </form>
    </div>
  );
};

export default EditPlace;
