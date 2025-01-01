import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Use BrowserRouter here
import './App.css';
import Side from './page/Side/Side';
import Home from './page/Home/Home';
import Login from './page/Login/Login';

function App() {
  const user = localStorage.getItem('user');
  return (
    <>
      <Router>
        {/* Show Side only if user exists */}
        {user && <Side />}

        <Routes>
          {/* Redirect to Login if no user */}
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
