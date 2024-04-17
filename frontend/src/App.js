import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './contexts/AuthContext'; 
import ScheduleAppointment from './components/ScheduleAppointment';
import SlotsManagement from './components/SlotsManagement';


function App() {
  const { user } = useAuth();

  return (
    <Router>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            {user ? (user.role === 'doctor' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/patient-dashboard" />) : <Navigate to="/login" />}
          </ProtectedRoute>
        } />
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient-dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manage-slots" element={
          <ProtectedRoute>
            <SlotsManagement />
          </ProtectedRoute>
        } />
        <Route path="/schedule-appointment" element={
          <ProtectedRoute>
            <ScheduleAppointment />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
