import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbxbG3Zrp8cuGmVMUtH3MB5JIOulR2nZ7dc81d67toYJNIupxuxjtdJAPGYmTgWs9dLT/exec?employeeId=${employeeId}&email=${email}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            window.location.reload();

            if (result.success) {
                // Save the response to localStorage
                localStorage.setItem('user', JSON.stringify(result.data));
                navigate('/'); // Redirect to home page
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <form
                onSubmit={handleLogin}
                className="bg-white p-4 rounded shadow-sm w-50"
            >
                <h2 className="mb-4 text-center">Login</h2>

                {error && <p className="text-danger text-center mb-3">{error}</p>}

                <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label fw-bold">Employee ID</label>
                    <input
                        type="text"
                        id="employeeId"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                >
                    Login
                </button>
            </form>
        </div>

    );
};

export default Login;
