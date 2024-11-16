import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        UserName: '',
        Password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { UserName, Password } = signupInfo;
        if (!UserName || !Password) {
            return handleError('Username and password are required');
        }
        try {
            const url = `http://localhost:3000/api/signup`; // Adjust for your environment
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupInfo),
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                handleError(error.details[0]?.message || 'An error occurred');
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError('Something went wrong');
        }
    };

    return (
        <div className="container">
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor="UserName">Username</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="UserName"
                        autoFocus
                        placeholder="Enter your username..."
                        value={signupInfo.UserName}
                    />
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="Password"
                        placeholder="Enter your password..."
                        value={signupInfo.Password}
                    />
                </div>
                <button type="submit">Signup</button>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
