import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { useStudio } from '../context/StudioContext';
import { supabase } from '../supabase/client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { studios, loading, error, deleteStudio } = useStudio();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleDeleteClick = (studio) => {
    setSelectedStudio(studio);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteStudio(selectedStudio.id);
      setSnackbar({
        open: true,
        message: 'Studio uğurla silindi',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Studio silinərkən xəta baş verdi',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setSnackbar({
          open: true,
          message: 'Çıxış zamanı xəta baş verdi',
          severity: 'error'
        });
        return;
      }
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      setSnackbar({
        open: true,
        message: 'Sistem xətası baş verdi',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <Typography>Yüklənir...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, px: isMobile ? 2 : 3 }}>
        <Typography color="error">Xəta: {error}</Typography>
      </Container>
    );
  }

  const MobileView = () => (
    <Stack spacing={2}>
      {sortedStudios.map((studio) => (
        <Card key={studio.id} sx={{ width: '100%' }}>
          <CardContent>
            {/* Studio adı */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6">
                {studio.name}
              </Typography>
              <Box>
                <IconButton 
                  size="small"
                  onClick={() => navigate(`/admin/studio/edit/${studio.id}`)}
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => handleDeleteClick(studio)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Ümumi statistika */}
            <Box sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              p: 1.5,
              borderRadius: 1,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ViewIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {(studio.stats?.views || 0) + 
                 (studio.stats?.phoneViews || 0) + 
                 (studio.stats?.addressViews || 0) + 
                 (studio.stats?.instagramViews || 0) +
                 (studio.stats?.whatsappViews || 0)}
              </Typography>
            </Box>

            {/* Detallı statistikalar */}
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1
                  }}
                >
                  <ViewIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Kart
                  </Typography>
                  <Typography variant="h6">
                    {studio.stats?.views || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1
                  }}
                >
                  <PhoneIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Telefon
                  </Typography>
                  <Typography variant="h6">
                    {studio.stats?.phoneViews || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1
                  }}
                >
                  <LocationIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ünvan
                  </Typography>
                  <Typography variant="h6">
                    {studio.stats?.addressViews || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1
                  }}
                >
                  <InstagramIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Instagram
                  </Typography>
                  <Typography variant="h6">
                    {studio.stats?.instagramViews || 0}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 1
                  }}
                >
                  <WhatsAppIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    WhatsApp
                  </Typography>
                  <Typography variant="h6">
                    {studio.stats?.whatsappViews || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const DesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Studio Adı</TableCell>
            <TableCell align="center">Ümumi Baxış</TableCell>
            <TableCell align="center">Kart Baxışı</TableCell>
            <TableCell align="center">Telefon</TableCell>
            <TableCell align="center">Ünvan</TableCell>
            <TableCell align="center">Instagram</TableCell>
            <TableCell align="center">WhatsApp</TableCell>
            <TableCell align="center">Əməliyyatlar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStudios.map((studio) => (
            <TableRow key={studio.id}>
              <TableCell>{studio.name}</TableCell>
              <TableCell align="center">
                {(studio.stats?.views || 0) + 
                 (studio.stats?.phoneViews || 0) + 
                 (studio.stats?.addressViews || 0) + 
                 (studio.stats?.instagramViews || 0) +
                 (studio.stats?.whatsappViews || 0)}
              </TableCell>
              <TableCell align="center">{studio.stats?.views || 0}</TableCell>
              <TableCell align="center">{studio.stats?.phoneViews || 0}</TableCell>
              <TableCell align="center">{studio.stats?.addressViews || 0}</TableCell>
              <TableCell align="center">{studio.stats?.instagramViews || 0}</TableCell>
              <TableCell align="center">{studio.stats?.whatsappViews || 0}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/admin/studio/edit/${studio.id}`)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(studio)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container sx={{ 
      mt: isMobile ? 2 : 4,
      px: isMobile ? 2 : 3
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: isMobile ? 2 : 4,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"}>
          Admin Panel
        </Typography>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={2}
          width={isMobile ? '100%' : 'auto'}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/studio/new')}
            fullWidth={isMobile}
          >
            Yeni Studio
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            fullWidth={isMobile}
          >
            Çıxış
          </Button>
        </Stack>
      </Box>

      {/* Content */}
      {isMobile ? <MobileView /> : <DesktopView />}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth={isMobile}
      >
        <DialogTitle>Studionu silmək istədiyinizə əminsiniz?</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedStudio?.name} studiosunu silmək istəyirsiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Ləğv et</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
