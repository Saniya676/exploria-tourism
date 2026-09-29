import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Destinations from './pages/public/Destinations';
import DestinationDetails from './pages/public/DestinationDetails';
import Packages from './pages/public/Packages';
import PackageDetails from './pages/public/PackageDetails';
import Adventures from './pages/public/Adventures';
import AdventureDetails from './pages/public/AdventureDetails';
import WeatherPage from './pages/public/WeatherPage';
import GuidesPage from './pages/public/GuidesPage';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import MyProfile from './pages/user/MyProfile';
import MyInquiries from './pages/user/MyInquiries';
import MyBookings from './pages/user/MyBookings';
import FavoritesPage from './pages/user/FavoritesPage';

// Guide Pages
import GuideDashboard from './pages/guide/GuideDashboard';
import GuideProfile from './pages/guide/GuideProfile';
import GuideRequests from './pages/guide/GuideRequests';
import GuideBookings from './pages/guide/GuideBookings';
import GuideAvailability from './pages/guide/GuideAvailability';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageGuides from './pages/admin/ManageGuides';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManageAdventures from './pages/admin/ManageAdventures';
import ManagePackages from './pages/admin/ManagePackages';
import ManageInquiries from './pages/admin/ManageInquiries';
import ManageBookings from './pages/admin/ManageBookings';
import ManageReviews from './pages/admin/ManageReviews';
import Analytics from './pages/admin/Analytics';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetails />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/adventures" element={<Adventures />} />
        <Route path="/adventures/:id" element={<AdventureDetails />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>

      {/* User Dashboard Routes */}
      <Route element={<DashboardLayout allowedRoles={['USER', 'GUIDE', 'ADMIN']} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/profile" element={<MyProfile />} />
        <Route path="/dashboard/inquiries" element={<MyInquiries />} />
        <Route path="/dashboard/bookings" element={<MyBookings />} />
      </Route>

      {/* Guide Dashboard Routes */}
      <Route element={<DashboardLayout allowedRoles={['GUIDE', 'ADMIN']} />}>
        <Route path="/guide" element={<GuideDashboard />} />
        <Route path="/guide/profile" element={<GuideProfile />} />
        <Route path="/guide/requests" element={<GuideRequests />} />
        <Route path="/guide/bookings" element={<GuideBookings />} />
        <Route path="/guide/availability" element={<GuideAvailability />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/guides" element={<ManageGuides />} />
        <Route path="/admin/destinations" element={<ManageDestinations />} />
        <Route path="/admin/adventures" element={<ManageAdventures />} />
        <Route path="/admin/packages" element={<ManagePackages />} />
        <Route path="/admin/inquiries" element={<ManageInquiries />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/reviews" element={<ManageReviews />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
