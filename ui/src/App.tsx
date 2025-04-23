import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Main/Home";
import Login from "./Components/Main/Login";
import Register from "./Components/Main/Register";
import Cart from "./Components/Main/Cart";
import HomePageAdmin from "./Components/admin/HomePageAdmin";
import HomePageFarmer from "./Components/farmer/HomePageFarmer";
import HomePageExpert from "./Components/expert/HomePageExpert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications
import AddProduct from "./Components/admin/AddProduct";
import ViewProductsAdmin from "./Components/admin/ViewProductsAdmin";
import AddExperts from "./Components/admin/AddExperts";
import ViewExpertsAdmin from "./Components/admin/ViewExpertsAdmin";
import AddSchemes from "./Components/admin/AddSchemes";
import ViewShemesAdmin from "./Components/admin/ViewShemesAdmin";
import ViewAppointmentsFarmer from "./Components/farmer/ViewAppointmentsFarmer";
import ViewAppointmentsExpert from "./Components/expert/ViewAppointmentsExpert";
import ViewAppointmentsAdmin from "./Components/admin/ViewAppointmentsAdmin";
import Community from "./Components/Main/Community";
import ProductDetails from "./Components/Main/ProductDetails";
import AddToCartPage from "./Components/Main/AddToCartPage";
const App: React.FC = () => {
  return (
    <div>
      <ToastContainer draggable position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<HomePageAdmin />}>
            <Route path="add-product" element={<AddProduct/>} />
            <Route path="add-scheme" element={<AddSchemes  />} />
            <Route path="schemes" element={<ViewShemesAdmin/>} />
            <Route path="add-expert" element={<AddExperts />} />
            <Route path="experts" element={<ViewExpertsAdmin />} />
            <Route path="products" element={<ViewProductsAdmin />} />
          <Route path="appointments" element={<ViewAppointmentsAdmin/>} />

          </Route>
          <Route path="/farmer" element={<HomePageFarmer />}>
            <Route path="appointments" element={<ViewAppointmentsFarmer />} />
            <Route path="community-forum" element={<Community />} />
          </Route>
          <Route path="/expert" element={<HomePageExpert />}>
          <Route path="appointments" element={<ViewAppointmentsExpert />} />
          <Route path="chat" element={<Community />} />
          </Route>



          <Route path="/product/:id" element={<ProductDetails />} />
           <Route path="/addtocart" element={<AddToCartPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
