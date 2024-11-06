import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {
  const [isRegistered, setIsRegistered] = useState(true); // Determines if the user is logging in or registering
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Determines if the user is updating profile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user data for updating profile
  useEffect(() => {
    if (isUpdatingProfile) {
      const token = localStorage.getItem('authToken');
      if (token) {
        fetch('/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUsername(data.username);
            setEmail(data.email);
            setImageUrl(data.imageUrl);
          })
          .catch((err) => setErrorMessage('Failed to fetch user data.'));
      }
    }
  }, [isUpdatingProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isRegistered ? '/api/login' : '/api/signup';
    const body = isRegistered
      ? { email, password }
      : { email, password, username, imageUrl };

    const method = 'POST'; // POST method for both login and signup

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log the response to help debug
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          navigate('/places'); // Redirect to places page after login
        } else if (data.error) {
          setErrorMessage(data.error);
        }
      })
      .catch((err) => {
        console.error('Network or server error: ', err);  // Log network error for debugging
        setErrorMessage('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isRegistered ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <label htmlFor="email">И-мэйл</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input">
            <label htmlFor="password">Нууц үг</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isRegistered && (
            <>
              <div className="auth-input">
                <label htmlFor="username">Хэрэглэгчийн нэр</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input">
                <label htmlFor="imageUrl">Зураг URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button type="submit">
            {isRegistered ? 'Нэвтрэх' : isUpdatingProfile ? 'Мэдээлэл Шинэчлэх' : 'Бүртгүүлэх'}
          </button>
        </form>
        <div className="auth-toggle">
          {isRegistered ? (
            <>
              <span>Шинэ хэрэглэгч үү?</span>
              <button onClick={() => setIsRegistered(false)}>Бүртгүүлэх</button>
            </>
          ) : (
            <>
              <span>Бүртгэлтэй хэрэглэгч үү?</span>
              <button onClick={() => setIsRegistered(true)}>Нэвтрэх</button>
            </>
          )}
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Authenticate;
