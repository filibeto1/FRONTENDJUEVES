// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Aquí puedes agregar tu header */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      {/* Aquí puedes agregar tu footer */}
    </Box>
  );
};

export default Layout;