import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import LandingPage from '../pages/public/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import DoctorsManagement from '../pages/admin/DoctorsManagement';
import PatientsManagement from '../pages/admin/PatientsManagement';
import DepartmentsManagement from '../pages/admin/DepartmentsManagement';
import AppointmentsManagement from '../pages/admin/AppointmentsManagement';

// Doctor pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorMyAppointments from '../pages/doctor/MyAppointments';

// Patient pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import BrowseDoctors from '../pages/patient/BrowseDoctors';
import BookAppointment from '../pages/patient/BookAppointment';
import PatientMyAppointments from '../pages/patient/MyAppointments';
import PatientProfile from '../pages/patient/PatientProfile';

import { ROLES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Protected Routes with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<DoctorsManagement />} />
        <Route path="/admin/patients" element={<PatientsManagement />} />
        <Route path="/admin/departments" element={<DepartmentsManagement />} />
        <Route path="/admin/appointments" element={<AppointmentsManagement />} />
      </Route>

      {/* Doctor Protected Routes with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorMyAppointments />} />
      </Route>

      {/* Patient Protected Routes with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/doctors" element={<BrowseDoctors />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<PatientMyAppointments />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
