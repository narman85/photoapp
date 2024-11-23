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
  Alert,
  Input
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
    address: '',
    description: '',
    images: [],
    features: [],
    contact: {
      phone: '',
      whatsapp: '',
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
          address: studio.address || '',
          description: studio.description || '',
          images: studio.images || [],
          features: studio.features || [],
          contact: {
            phone: studio.contact?.phone || '',
            whatsapp: studio.contact?.whatsapp || '',
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

  // Şəkil URL-ni yeniləmə
  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
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

  // Xüsusiyyəti yeniləmə
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
        await updateStudio(id, formData);
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
      navigate('/admin/dashboard');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Xəta baş verdi',
        severity: 'error'
      });
    }
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {id ? 'Studionu Redaktə Et' : 'Yeni Studio'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Əsas məlumatlar */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Studio adı"
                name="name"
                value={formData.name}
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
                    label={`Şəkil ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleImageDelete(index)}
                  >
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
                    label={`Xüsusiyyət ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleFeatureDelete(index)}
                  >
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleChange}
                required
                helperText="Məsələn: +994501234567"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="WhatsApp"
                name="contact.whatsapp"
                value={formData.contact.whatsapp}
                onChange={handleChange}
                helperText="Məsələn: +994501234567"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instagram"
                name="contact.instagram"
                value={formData.contact.instagram}
                onChange={handleChange}
                helperText="Məsələn: @studiophotography"
              />
            </Grid>

            {/* Submit düyməsi */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                >
                  Ləğv Et
                </Button>
                <Button
                  type="submit"
                  variant="contained"
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
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar */}
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
