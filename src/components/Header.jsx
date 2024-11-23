import React from 'react';
import { Box, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <Box 
      onClick={() => navigate('/')}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        p: 2,
        pl: 3,
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.02)'
        }
      }}
    >
      <PhotoCameraIcon sx={{ fontSize: 28 }} />
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ 
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}
      >
        Photo Studio
      </Typography>
    </Box>
  );
};

export default Header;
