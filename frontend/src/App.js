import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import FundDetails from './pages/FundDetails';
import Recommendations from './pages/Recommendations';
import Compare from './pages/Compare';
import Calculator from './pages/Calculator';
import Profile from './pages/Profile';

function parseJwtPayload(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}

// Handles Google OAuth redirect: /oauth-success?token=<JWT>
function OAuthSuccess() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const token = params.get('token');

  React.useEffect(() => {
  if (token) {
    try {
      const payload = parseJwtPayload(token);
      login({
        token,
        email: payload.sub,  // ✅ email only
      });
      navigate('/dashboard', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  } else {
    navigate('/login', { replace: true });
  }
}, [token, login, navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div className="spinner" />
    </div>
  );
}

function OAuthTokenHandler() {
  const { login, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) return;

    const params = new URLSearchParams(location.search);
    const tokenFromSearch = params.get('token');

    // Optional fallback for providers/configs that return token in hash.
    const hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    const tokenFromHash = hashParams.get('token');

    const token = tokenFromSearch || tokenFromHash;
    if (!token) return;

    try {
      const payload = parseJwtPayload(token);
      login({
        token,
        email: payload.sub || '',
      });
      navigate('/dashboard', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  }, [location.search, location.hash, isLoggedIn, login, navigate]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <OAuthTokenHandler />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/search" element={<Search />} />
        <Route path="/funds/:schemeCode" element={<FundDetails />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
