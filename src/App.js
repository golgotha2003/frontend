import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginPage from './BodyContent/Guest/login/login';
import Register from './BodyContent/Guest/Register/register';
import Home from './BodyContent/Guest/Home/Home';
import AdminDashboard from './BodyContent/Admin/AdminDashboard/AdminDashboard';
import AdminUsers from './BodyContent/Admin/AdminUsers/AdminUsers';
import AdminSettings from './BodyContent/Admin/AdminSettings/AdminSettings';
import CreateProduct from './BodyContent/Admin/create-product/CreateProduct';
import ManageProduct from './BodyContent/Admin/ManageProduct/ManageProduct';
import UpdateNgocRong from './BodyContent/Admin/UpdateNgocRong/UpdateNgocrong';
import UpdateLienMinh from './BodyContent/Admin/UpdateLienMinh/UpdateLienMinh';
import UpdateHiepsi from './BodyContent/Admin/UpdateHiepSi/UpdateHiepsi';
import NgocRong from './BodyContent/Guest/NgocRongPage/NgocRongPage';

const App = () => {
  // Determine whether to show the Sidebar or not based on the route path
  const showSidebar = window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      {/* Conditionally render the Navbar or Sidebar based on the route path */}
      {showSidebar ? <Sidebar /> : <Navbar />}
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ngocrong" element={<NgocRong />} />
        {/* Add other routes for the admin pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/manage-products" element={<ManageProduct />} />
        <Route path="/admin/ngocrong/edit-product/:id" element={<UpdateNgocRong />} />
        <Route path="/admin/lienminh/edit-product/:id" element={<UpdateLienMinh />} />
        <Route path="/admin/hiepsi/edit-product/:id" element={<UpdateHiepsi />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
