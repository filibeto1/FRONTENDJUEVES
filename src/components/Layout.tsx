// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useIsMounted } from '../hooks/useIsMounted';
import { useEffect } from 'react'; // Añadir import

const Layout = () => {
  const isMounted = useIsMounted();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;