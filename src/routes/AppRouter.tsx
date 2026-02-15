import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import AppLayout from '../components/AppLayout';
import Dashboard from '../pages/Dashboard';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login';
import Planificador from '../pages/Planificador';
import Productos from '../pages/Productos';

const AppRouter = (): JSX.Element => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      element={(
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      )}
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/planificador" element={<Planificador />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Route>
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default AppRouter;
