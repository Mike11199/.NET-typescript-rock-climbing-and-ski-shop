import { Route, Routes, BrowserRouter } from "react-router-dom";

//components
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";

//user components
import RoutesWithUserChatComponent from "./pages/user/RoutesWithUserChatComponent";

// public pages
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductListPage from "./pages/ProductListPage";
import RegisterPage from "./pages/RegisterPage";

// protected user pages
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";

// protected admin pages
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminEditUserPage from "./pages/admin/AdminEditUserPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminChatsPage from "./pages/admin/AdminChatsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

//utils
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <HeaderComponent />
      <Routes>
        <Route element={<RoutesWithUserChatComponent />}>
          {/* publicly available routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product-list" element={<ProductListPage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element="404 - page does not exist" />
        </Route>
        {/* user protected routes */}
        <Route element={<ProtectedRoutesComponent admin={false}/>}>
          <Route path="/user"  element={<UserProfilePage />}/>
          <Route path="/user/my-orders"  element={<UserOrdersPage />}/>
          <Route path="/user/cart-details"  element={<UserCartDetailsPage />}/>
          <Route path="/user/order-details/:id"  element={<UserOrderDetailsPage />}/>
        </Route>
        {/* admin protected routes */}
        <Route element={<ProtectedRoutesComponent admin={true}/>}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/edit-user" element={<AdminEditUserPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/create-new-product" element={<AdminCreateProductPage />} />
          <Route path="/admin/edit-product" element={<AdminEditProductPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/order-details/:id" element={<AdminOrderDetailsPage />} />
          <Route path="/admin/chats" element={<AdminChatsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>        
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
