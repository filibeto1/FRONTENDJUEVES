// Crea este archivo:

// src/components/shared/LoadingSpinner.tsx
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="200px"
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default LoadingSpinner;