import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Card,
  CardMedia,
  Button,
  CircularProgress,
  Paper,
  IconButton
} from '@mui/material';
import { useStudio } from '../context/StudioContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StudioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudioById, loading, error, updateStats } = useStudio();
  const [studio, setStudio] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    const studio = getStudioById(id);
    if (studio) {
      setStudio(studio);
    }
  }, [id, getStudioById]);

  // Şəkil dəyişdirmə funksiyaları
  const goToPreviousImage = () => {
    if (studio?.images?.length) {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : studio.images.length - 1));
    }
  };

  const goToNextImage = () => {
    if (studio?.images?.length) {
      setSelectedImage((prev) => (prev < studio.images.length - 1 ? prev + 1 : 0));
    }
  };

  // Klaviatura ilə şəkil dəyişdirmə
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studio]);

  // Telefon nömrəsinə klik
  const handlePhoneClick = () => {
    if (!showPhone) {
      updateStats(id, 'phoneViews');
      setShowPhone(true);
    } else {
      // Nömrə artıq göstərilibsə, zəng et
      window.location.href = `tel:${studio.contact?.phone}`;
    }
  };

  // Ünvan klik
  const handleAddressClick = () => {
    updateStats(id, 'addressViews');
    if (studio?.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.address)}`, '_blank');
    }
    setShowAddress(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          Xəta baş verdi: {error}
        </Typography>
      </Container>
    );
  }

  if (!studio) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>
          Studio tapılmadı
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Geri düyməsi */}
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Studio məlumatları */}
      <Grid container spacing={4}>
        {/* Sol tərəf - Şəkillər */}
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative' }}>
            <Card>
              <Box sx={{ 
                position: 'relative',
                height: 500,
                overflow: 'hidden',
                bgcolor: 'grey.100'
              }}>
                {/* Arxa fon şəkli (blur) */}
                <CardMedia
                  component="img"
                  image={studio.images?.[selectedImage] || "https://via.placeholder.com/800x500"}
                  alt="background"
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(10px)',
                    transform: 'scale(1.1)',
                    opacity: 0.7,
                  }}
                />
                {/* Əsas şəkil (fit edilmiş) */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CardMedia
                    component="img"
                    image={studio.images?.[selectedImage] || "https://via.placeholder.com/800x500"}
                    alt={studio.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Box>
            </Card>
            
            {/* Şəkil dəyişdirmə düymələri */}
            {studio.images?.length > 1 && (
              <>
                <IconButton
                  onClick={goToPreviousImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton
                  onClick={goToNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' }
                  }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </Box>

          {/* Kiçik şəkillər */}
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {studio.images?.map((image, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    opacity: selectedImage === index ? 1 : 0.6,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 }
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <Box sx={{ 
                    position: 'relative',
                    height: 80,
                    overflow: 'hidden',
                    bgcolor: 'grey.100'
                  }}>
                    {/* Arxa fon şəkli (blur) */}
                    <CardMedia
                      component="img"
                      image={image}
                      alt="background"
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(10px)',
                        transform: 'scale(1.1)',
                        opacity: 0.7,
                      }}
                    />
                    {/* Kiçik şəkil (fit edilmiş) */}
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`${studio.name} - ${index + 1}`}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sağ tərəf - Məlumatlar */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Studio adı */}
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 600,
                borderBottom: '2px solid #f0f0f0',
                pb: 2,
                mb: 2
              }}
            >
              {studio.name}
            </Typography>

            {/* Təsvir */}
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.8,
                mb: 2
              }}
            >
              {studio.description}
            </Typography>

            {/* Paketlər */}
            {studio.features && (
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      width: 4,
                      height: 20,
                      backgroundColor: 'primary.main',
                      marginRight: 1,
                      borderRadius: 1
                    }
                  }}
                >
                  Paketlər
                </Typography>
                <Grid 
                  container 
                  spacing={1.5} 
                  sx={{ 
                    maxHeight: '200px',
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '10px',
                      '&:hover': {
                        background: '#666'
                      }
                    }
                  }}
                >
                  {studio.features.map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'text.secondary',
                          pl: 1
                        }}
                      >
                        <span style={{ 
                          marginRight: '10px',
                          color: 'primary.main',
                          fontSize: '8px'
                        }}>●</span>
                        {feature}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Əlaqə bölməsi */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {/* Sosial media düymələri */}
              <Box 
                sx={{ 
                  display: 'flex',
                  gap: 2
                }}
              >
                {/* Instagram */}
                {studio.contact?.instagram && (
                  <Button
                    startIcon={<InstagramIcon />}
                    onClick={() => {
                      updateStats(id, 'instagramViews');
                      window.open(`https://instagram.com/${studio.contact.instagram.replace('@', '')}`, '_blank');
                    }}
                    sx={{ 
                      flex: 1,
                      py: 1.5,
                      backgroundColor: 'action.hover',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    Instagram
                  </Button>
                )}

                {/* WhatsApp */}
                {studio.contact?.whatsapp && (
                  <Button
                    startIcon={<WhatsAppIcon />}
                    onClick={() => {
                      updateStats(id, 'whatsappViews');
                      window.open(`https://wa.me/${studio.contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
                    }}
                    sx={{ 
                      flex: 1,
                      py: 1.5,
                      backgroundColor: 'action.hover',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    WhatsApp
                  </Button>
                )}
              </Box>

              {/* Ünvan */}
              <Button
                fullWidth
                startIcon={<LocationOnIcon />}
                onClick={handleAddressClick}
                sx={{ 
                  py: 1.5,
                  backgroundColor: 'action.hover',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  }
                }}
              >
                {showAddress ? studio.address : 'Ünvanı göstər'}
              </Button>

              {/* Əlaqə düyməsi */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePhoneClick}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: 2
                }}
              >
                {showPhone ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon />
                    {studio.contact?.phone}
                  </Box>
                ) : (
                  "Əlaqə saxla"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudioDetailPage;
