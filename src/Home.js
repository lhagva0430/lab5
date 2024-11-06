import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PageStyle.css';

const Home = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Get the list of users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    return (
        <div className="page-container">
            <h2>Хэрэглэгчийн жагсаалт</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <Link to={`/${user.username}/places`}>{user.username}</Link> {/* Use username instead of ID */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Одоогоор хэрэглэгчид бүртгэгдээгүй байна.</p>
            )}
        </div>
    );
};

export default Home;