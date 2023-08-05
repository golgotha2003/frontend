import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar';
import Usermenu from './components/UserMenu';
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
import NgocRongDetails from './BodyContent/Guest/NgocRongPage/NgocRongdetail/NgocRongdetail';
import LienMinh from './BodyContent/Guest/LienMinhPage/LienMinhPage';
import LienMinhDetails from './BodyContent/Guest/LienMinhPage/LienMinhdetail/Lienminhdetail';
import HiepSi from './BodyContent/Guest/HiepSiPage/HiepSiPage';
import HiepSiDetails from './BodyContent/Guest/HiepSiPage/Hiepsidetail/Hiepsidetail';
import NickDaMua from './BodyContent/User/nick-da-mua';
import Lichsugiaodich from './BodyContent/User/transaction';
import Naptien from './BodyContent/User/top-up';
import Profile from './BodyContent/User/profile';
import ChangePassword from './BodyContent/User/change-pass';


const App = () => {
  // Determine whether to show the Sidebar or not based on the route path
  const currentPath = window.location.pathname;
  const showSidebar = currentPath.startsWith('/admin');
  const UserMenu = currentPath.startsWith('/user');

  return (
    <BrowserRouter>
      {/* Conditionally render the Navbar or Sidebar based on the route path */}
      {showSidebar ? <Sidebar /> : <Navbar />}
      {UserMenu && <Usermenu/>}
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ngocrong" element={<NgocRong />} />
        <Route path="/ngocrong/:id" element={<NgocRongDetails />} />
        <Route path="/lienminh" element={<LienMinh />} />
        <Route path="/lienminh/:id" element={<LienMinhDetails />} />
        <Route path="/hiepsi" element={<HiepSi />} />
        <Route path="/hiepsi/:id" element={<HiepSiDetails />} />
        {/* Add other routes for the admin pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/manage-products" element={<ManageProduct />} />
        <Route path="/admin/ngocrong/edit-product/:id" element={<UpdateNgocRong />} />
        <Route path="/admin/lienminh/edit-product/:id" element={<UpdateLienMinh />} />
        <Route path="/admin/hiepsi/edit-product/:id" element={<UpdateHiepsi />} />
        {/* Add other routes for the user pages */}
        <Route path="/user/nick-da-mua" element={<NickDaMua />} />
        <Route path="/user/lich-su-giao-dich" element={<Lichsugiaodich />} />
        <Route path="/user/nap-tien" element={<Naptien />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/doi-mat-khau" element={<ChangePassword />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
