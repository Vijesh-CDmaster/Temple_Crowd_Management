import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Header, Footer } from './components';
import Home from './features/Home/Home';
import Temples from './features/Temples/Temples';
import VirtualQueue from './features/VirtualQueue/VirtualQueue';
import MyTokens from './features/MyTokens/MyTokens';
import History from './features/History/History';
import Maps from './features/Maps/Maps';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temple-gold mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

// Redirect if already authenticated
function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temple-gold mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
  
  return isAuthenticated ? <Navigate to="/temples" replace /> : children;
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Header />
        <ScrollToTop />
        <main>
          <Routes>
            {/* ✅ PUBLIC ROUTES (No Login Required) */}
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<Maps />} />
            
            {/* ✅ AUTH ROUTES - Redirect if already logged in */}
            <Route 
              path="/signin" 
              element={
                <RedirectIfAuthenticated>
                  <SignIn />
                </RedirectIfAuthenticated>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <RedirectIfAuthenticated>
                  <SignUp />
                </RedirectIfAuthenticated>
              } 
            />

            {/* ✅ PROTECTED ROUTES - Login REQUIRED */}
            <Route 
              path="/temples" 
              element={
                <ProtectedRoute>
                  <Temples />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/virtual-queue" 
              element={
                <ProtectedRoute>
                  <VirtualQueue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-tokens" 
              element={
                <ProtectedRoute>
                  <MyTokens />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />

            {/* ✅ CATCH ALL - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
