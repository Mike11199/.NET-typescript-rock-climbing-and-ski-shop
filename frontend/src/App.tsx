import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// components:
import HeaderComponent from "./components/header/HeaderComponent";
import FooterComponent from "./components/FooterComponent";

// publicly available pages:
import CartPage from "./pages/CartPage/CartPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

// customer account pages:
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";

import ScrollToTop from "./utils/ScrollToTop";
import setupAxiosInterceptor from "./utils/AxiosSetup";

import { Toaster } from "react-hot-toast";

function App() {
  setupAxiosInterceptor();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderComponent />
      <Toaster />
      <Routes>
        {/* publicly available routes: */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product-list" element={<ProductListPage />} />
        <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element="Page not exists 404" />

        {/* customer account routes; API endpoints enforce authentication: */}
        <Route path="/user" element={<UserProfilePage />} />
        <Route path="/user/my-orders" element={<UserOrdersPage />} />
        <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
        <Route
          path="/user/order-details/:id"
          element={<UserOrderDetailsPage />}
        />

        <Route path="/admin/*" element={<Navigate to="/user" replace />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
