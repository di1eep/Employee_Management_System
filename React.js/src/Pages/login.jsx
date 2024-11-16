import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        UserName: '',
        Password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { UserName, Password } = loginInfo;
        if (!UserName || !Password) {
            return handleError('Username and password are required');
        }
        try {
            const url = `http://localhost:3000/api/login`; // Update URL as per your environment
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { success, message, token, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', UserName);
                setTimeout(() => {
                    navigate('/home');
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
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="UserName">Username</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="UserName"
                        placeholder="Enter your username..."
                        value={loginInfo.UserName}
                    />
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="Password"
                        placeholder="Enter your password..."
                        value={loginInfo.Password}
                    />
                </div>
                <button type="submit">Login</button>
                <span>
                    Don't have an account? <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
