import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RequireAdmin from './components/RequireAdmin'
import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import AnalyticsTab from './components/admin/AnalyticsTab'
import OrdersTab from './components/admin/OrdersTab'
import ProductsTab from './components/admin/ProductsTab'
import UsersTab from './components/admin/UsersTab'

// location.key changes on every navigation (even to the same #hash), so repeat clicks always scroll
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0 }); return }
    const id = decodeURIComponent(hash.slice(1))
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  }, [pathname, hash, key])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>}>
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<AnalyticsTab />} />
            <Route path="orders" element={<OrdersTab />} />
            <Route path="products" element={<ProductsTab />} />
            <Route path="users" element={<UsersTab />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}