import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography,
  Box,
  CardActionArea,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { studios, loading, error, updateStats } = useStudio();

  // Studio kartına klik ediləndə
  const handleStudioClick = (studioId) => {
    // Baxış sayını artır
    updateStats(studioId, 'views');
    // Studio səhifəsinə yönləndir
    navigate(`/studio/${studioId}`);
  };

  // Telefon nömrəsinə klik ediləndə
  const handlePhoneClick = (e, studioId) => {
    e.stopPropagation();
    updateStats(studioId, 'phoneViews');
  };

  // Yükləmə zamanı
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Xəta baş verərsə
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          Xəta baş verdi: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={1}>
        {studios.map((studio) => (
          <Grid item xs={5} sm={3} md={2} key={studio.id}>
            <Card 
              sx={{ 
                height: '100%',
                maxWidth: '100%',
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardActionArea onClick={() => handleStudioClick(studio.id)}>
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: '90%', // biraz daha az kvadrat
                  overflow: 'hidden',
                  bgcolor: 'grey.100'
                }}>
                  <CardMedia
                    component="img"
                    image={studio.images?.[0] || "https://via.placeholder.com/300x300"}
                    alt={studio.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 0.8, textAlign: 'center' }}>
                  <Typography variant="subtitle2" component="div" noWrap>
                    {studio.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" noWrap>
                    {studio.contact?.instagram}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
