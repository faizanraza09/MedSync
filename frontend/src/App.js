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
import PatientAppointments from './components/PatientAppointments';
import UploadMedicalRecords from './components/UploadMedicalRecords';
import PatientMedicalRecords from './components/PatientMedicalRecords';
import DiagnosticsForm from './components/DiagnosticsForm';
import Prescriptions from './components/Prescriptions';
import PrescriptionForm from './components/PrescriptionForm';
import PatientPrescriptions from './components/PatientPrescriptions';
import VideoCall from './components/VideoCall'
import DoctorAppointments from './components/DoctorAppointments';
import Home from './components/Home';



function App() {
  const { user } = useAuth();

  return (
    <Router>

      <Routes>
        <Route path="/" element={
          user ? (user.role === 'doctor' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/patient-dashboard" />) : <Home />
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/appointments" element={
          <ProtectedRoute>
            <PatientAppointments />
          </ProtectedRoute>
        } />
        <Route path="/doctor-appointments" element={
          <ProtectedRoute>
            <DoctorAppointments />
          </ProtectedRoute>
        } />
        <Route path="/schedule-appointment" element={
          <ProtectedRoute>
            <ScheduleAppointment />
          </ProtectedRoute>
        } />
        <Route path="/upload-medical-records" element={
          <ProtectedRoute>
            <UploadMedicalRecords />
          </ProtectedRoute>
        } />
        <Route path="/medical-records" element={
          <ProtectedRoute>
            <PatientMedicalRecords />
          </ProtectedRoute>
        } />
        <Route path="/diagnostics" element={
          <ProtectedRoute>
            <DiagnosticsForm />
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute>
            <Prescriptions />
          </ProtectedRoute>
        } />
        <Route path="/prescribe/:patientId" element={
          <ProtectedRoute>
            <PrescriptionForm />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <PatientPrescriptions />
          </ProtectedRoute>
        } />
        <Route path="/video-call/:roomID" element={
          <ProtectedRoute>
            <VideoCall />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;