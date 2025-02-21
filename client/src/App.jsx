import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
import Dashboard from './Components/Dashboard';
import LoginPage from './pages/Login.jsx';
import { AuthProvider } from './Context/authContext'; // Import AuthProvider
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute
import Users from './pages/Users.jsx';
import Alarms from './pages/Alarms.jsx';
import Devices from './pages/Devices.jsx';
import Add from "./Components/Add.jsx";
import AddMultiple from './Components/AddMultiple.jsx';
import Edit from './Components/Edit.jsx';
import Delete from './Components/Delete.jsx';
import View from './Components/View.jsx';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
          <Route path="/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
          <Route path="/users/add" element={<ProtectedRoute><Add type="users"/></ProtectedRoute>} />
          <Route path="/users/add-multiple" element={<ProtectedRoute><AddMultiple type="users" /></ProtectedRoute>} />
          <Route path="/users/edit" element={<ProtectedRoute><Edit type="users" /></ProtectedRoute>} />
          <Route path="/users/delete" element={<ProtectedRoute><Delete type="users" /></ProtectedRoute>} />
          <Route path="/users/view" element={<ProtectedRoute><View type="users" /></ProtectedRoute>} />
          <Route path="/devices/add" element={<ProtectedRoute><Add type="devices"/></ProtectedRoute>} />
          <Route path="/devices/add-multiple" element={<ProtectedRoute><AddMultiple type="devices" /></ProtectedRoute>} />
          <Route path="/devices/edit" element={<ProtectedRoute><Edit type="devices" /></ProtectedRoute>} />
          <Route path="/devices/delete" element={<ProtectedRoute><Delete type="devices" /></ProtectedRoute>} />
          <Route path="/devices/view" element={<ProtectedRoute><View type="devices" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
