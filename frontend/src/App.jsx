import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import CompanyStocksPage from './pages/CompanyStocksPage.jsx';
import MarketAnalysisPage from './pages/MarketAnalysisPage.jsx';

const App = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/company"
        element={(
          <ProtectedRoute role="company">
            <CompanyDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/buyer"
        element={(
          <ProtectedRoute role="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/buyer/company/:companyId"
        element={(
          <ProtectedRoute role="buyer">
            <CompanyStocksPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/buyer/analysis"
        element={(
          <ProtectedRoute role="buyer">
            <MarketAnalysisPage />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to={auth ? `/${auth.user.role}` : '/'} replace />} />
    </Routes>
  );
};

export default App;
