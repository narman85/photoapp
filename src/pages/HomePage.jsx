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
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { studios, loading, error, updateStats } = useStudio();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Studiolari ümumi baxış sayına görə sırala
  const sortedStudios = [...studios].sort((a, b) => {
    const getTotalViews = (studio) => (
      (studio.stats?.views || 0) + 
      (studio.stats?.phoneViews || 0) + 
      (studio.stats?.addressViews || 0) + 
      (studio.stats?.instagramViews || 0) +
      (studio.stats?.whatsappViews || 0)
    );
    return getTotalViews(b) - getTotalViews(a);
  });

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
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  // Xəta baş verərsə
  if (error) {
    return (
      <Container sx={{ 
        mt: 4,
        px: isMobile ? 2 : 3 
      }}>
        <Typography color="error">
          Xəta baş verdi: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: isMobile ? 1 : 2, 
        mb: 2,
        px: isMobile ? 1 : 3
      }}
    >
      <Grid container spacing={isMobile ? 1 : 2}>
        {sortedStudios.map((studio) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={studio.id}>
            <Card 
              sx={{ 
                height: '100%',
                maxWidth: '100%',
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                borderRadius: isMobile ? 1 : 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: isMobile ? 'none' : 'scale(1.02)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
                '&:active': {
                  transform: isMobile ? 'scale(0.98)' : 'none',
                }
              }}
            >
              <CardActionArea onClick={() => handleStudioClick(studio.id)}>
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: isMobile ? '100%' : '90%',
                  overflow: 'hidden',
                  bgcolor: 'grey.100'
                }}>
                  <CardMedia
                    component="img"
                    image={studio.images?.[0] || "https://via.placeholder.com/300x300"}
                    alt={studio.name}
                    loading="lazy"
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
                <CardContent 
                  sx={{ 
                    p: isMobile ? 1 : 1.5, 
                    textAlign: 'left',
                    '&:last-child': {
                      pb: isMobile ? 1 : 1.5
                    }
                  }}
                >
                  <Typography 
                    variant={isMobile ? "body2" : "subtitle1"} 
                    component="div" 
                    noWrap 
                    sx={{ 
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {studio.name}
                  </Typography>
                  <Typography 
                    variant={isMobile ? "caption" : "body2"} 
                    color="primary" 
                    sx={{ 
                      fontWeight: 'medium',
                      display: 'block'
                    }}
                  >
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
