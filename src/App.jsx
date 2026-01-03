import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { Header, Footer } from './components';
import Home from './features/Home/Home';
import Temples from './features/Temples/Temples';
import VirtualQueue from './features/VirtualQueue/VirtualQueue';
import MyTokens from './features/MyTokens/MyTokens';
import History from './features/History/History';
import Maps from './features/Maps/Maps';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Header />
        <ScrollToTop />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/temples" element={<Temples />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes - Login Required */}
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

            {/* Catch all */}
            <Route path="*" element={<Home />} />
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
