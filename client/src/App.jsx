import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
import Dashboard from './Components/Dashboard';
import LoginPage from './pages/Login.jsx';
import { AuthProvider } from './Context/authContext'; // Import AuthProvider
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute
import Users from './pages/Users.jsx';
import Alarms from './pages/Alarms.jsx';
import Devices from './pages/Devices.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protect the Dashboard route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
          <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
