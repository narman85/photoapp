import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useStudio } from '../context/StudioContext';

const StudioFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudioById, addStudio, updateStudio, loading, error, uploadImage } = useStudio();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    description: '',
    images: [],
    features: [],
    contact: {
      phone: '',
      email: '',
      instagram: ''
    }
  });

  // Mövcud studionu yükləyirik (redaktə rejimində)
  useEffect(() => {
    if (id) {
      const studio = getStudioById(id);
      if (studio) {
        setFormData({
          name: studio.name || '',
          price: studio.price || '',
          address: studio.address || '',
          description: studio.description || '',
          images: studio.images || [],
          features: studio.features || [],
          contact: {
            phone: studio.contact?.phone || '',
            email: studio.contact?.email || '',
            instagram: studio.contact?.instagram || ''
          }
        });
      }
    }
  }, [id, getStudioById]);

  // Form məlumatlarını yeniləyirik
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Şəkil əlavə etmə
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      
      if (!file) {
        throw new Error('Fayl seçilməyib');
      }

      console.log('Starting image upload:', file.name);
      const imageUrl = await uploadImage(file);
      
      console.log('Image uploaded successfully:', imageUrl);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));

      setSnackbar({
        open: true,
        message: 'Şəkil uğurla yükləndi',
        severity: 'success'
      });

    } catch (err) {
      console.error('Error in handleImageUpload:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Şəkil yüklənərkən xəta baş verdi',
        severity: 'error'
      });
    } finally {
      setUploading(false);
      // Fayl inputunu sıfırla
      e.target.value = '';
    }
  };

  // Şəkil silmə
  const handleImageDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Xüsusiyyət əlavə etmə
  const handleFeatureAdd = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Xüsusiyyət silmə
  const handleFeatureDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Xüsusiyyət mətnini yeniləmə
  const handleFeatureChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  // Formu göndərmə
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateStudio(parseInt(id), formData);
        setSnackbar({
          open: true,
          message: 'Studio uğurla yeniləndi',
          severity: 'success'
        });
      } else {
        await addStudio(formData);
        setSnackbar({
          open: true,
          message: 'Studio uğurla əlavə edildi',
          severity: 'success'
        });
      }
      navigate('/admin');
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Xəta baş verdi',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin')} size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {id ? 'Studionu Redaktə Et' : 'Yeni Studio'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Əsas məlumatlar */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Studio Adı"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qiymət"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ünvan"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Təsvir"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            {/* Şəkillər */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Şəkillər
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<AddIcon />}
                    disabled={uploading}
                  >
                    {uploading ? 'Yüklənir...' : 'Şəkil Əlavə Et'}
                  </Button>
                </label>
              </Box>
              {formData.images.map((image, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={image}
                    disabled
                  />
                  <IconButton onClick={() => handleImageDelete(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Xüsusiyyətlər */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Xüsusiyyətlər
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleFeatureAdd}
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  Xüsusiyyət Əlavə Et
                </Button>
              </Box>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Xüsusiyyət ${index + 1}`}
                  />
                  <IconButton onClick={() => handleFeatureDelete(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Əlaqə məlumatları */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Əlaqə Məlumatları
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Telefon"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Instagram"
                name="contact.instagram"
                value={formData.contact.instagram}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit düyməsi */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : id ? (
                  'Yenilə'
                ) : (
                  'Əlavə Et'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar bildirişləri */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudioFormPage;
