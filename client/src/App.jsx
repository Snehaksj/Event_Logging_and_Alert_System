import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
import Dashboard from './Components/Dashboard';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { AuthProvider } from './Context/authContext'; // Import AuthProvider
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protect the Dashboard route */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
