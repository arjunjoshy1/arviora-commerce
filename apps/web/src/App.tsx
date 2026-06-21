import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Home from './pages/home/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
      {/* Global cart drawer — available on every page. */}
      <CartDrawer />
    </BrowserRouter>
  );
}
