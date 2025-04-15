import { Outlet } from 'react-router-dom';

// Convertimos en un componente simple que solo renderiza sus rutas hijas
const ProtectedAdminRoute = () => {
  return <Outlet />;
};

export default ProtectedAdminRoute;