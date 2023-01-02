import { Route, Routes, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductListPage from "./pages/ProductListPage";
import RegisterPage from "./pages/RegisterPage";

// protected pages
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-list" element={<ProductListPage />} />
        <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element="404 - page does not exist" />
        {/* routes below will require login */}
        <Route element={<ProtectedRoutesComponent />}>
          <Route path="/user"  element={<UserProfilePage />}/>
          <Route path="/user/my-orders"  element={<UserOrdersPage />}/>
          <Route path="/user/cart-details"  element={<UserCartDetailsPage />}/>
          <Route path="/user/order-details"  element={<UserOrderDetailsPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
