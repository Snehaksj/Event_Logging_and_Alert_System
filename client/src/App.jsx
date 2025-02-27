import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
import Dashboard from './Components/Dashboard';
import LoginPage from './pages/Login.jsx';
import { AuthProvider } from './Context/authContext'; // Import AuthProvider
import ProtectedRoute from './Components/ProtectedRoute'; // Import ProtectedRoute
import Users from './pages/Users.jsx';
import Alarms from './pages/Alarms.jsx';
import Devices from './pages/Devices.jsx';
import AddUser from "./pages/AddUser.jsx";
import AddMultipleUser from './pages/AddMultipleUser.jsx';
import EditUser from './pages/EditUser.jsx';
import DeleteUser from './pages/DeleteUser.jsx';
import ViewUser from './pages/ViewUser.jsx';
import AddDevice from "./pages/AddDevice.jsx";
import AddMultipleDevice from './pages/AddMultipleDevice.jsx';
import EditDevice from './pages/EditDevice.jsx';
import DeleteDevice from './pages/DeleteDevice.jsx';
import ViewDevice from './pages/ViewDevice.jsx';
import AddAlarm from './pages/AddAlarm.jsx';
import ViewAlarm from './pages/ViewAlarm.jsx';



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
          <Route path="/users/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
          <Route path="/users/add-multiple" element={<ProtectedRoute><AddMultipleUser/></ProtectedRoute>} />
          <Route path="/users/edit" element={<ProtectedRoute><EditUser/></ProtectedRoute>} />
          <Route path="/users/delete" element={<ProtectedRoute><DeleteUser/></ProtectedRoute>} />
          <Route path="/users/view" element={<ProtectedRoute><ViewUser/></ProtectedRoute>} />
          <Route path="/devices/add" element={<ProtectedRoute><AddDevice/></ProtectedRoute>} />
          <Route path="/devices/add-multiple" element={<ProtectedRoute><AddMultipleDevice /></ProtectedRoute>} />
          <Route path="/devices/edit" element={<ProtectedRoute><EditDevice/></ProtectedRoute>} />
          <Route path="/devices/delete" element={<ProtectedRoute><DeleteDevice/></ProtectedRoute>} />
          <Route path="/devices/view" element={<ProtectedRoute><ViewDevice/></ProtectedRoute>} />
          <Route path="/alarms/create" element={<ProtectedRoute><AddAlarm/></ProtectedRoute>} />
          <Route path="/alarms/view" element={<ProtectedRoute><ViewAlarm/></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;