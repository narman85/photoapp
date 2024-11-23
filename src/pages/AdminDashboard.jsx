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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
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

  // Studio silmə dialoqunu aç
  const handleDeleteClick = (studio) => {
    setSelectedStudio(studio);
    setDeleteDialogOpen(true);
  };

  // Studio silmə əməliyyatını təsdiqlə
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
    return <Typography>Yüklənir...</Typography>;
  }

  if (error) {
    return <Typography color="error">Xəta: {error}</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Admin Panel
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/studio/new')}
            sx={{ mr: 2 }}
          >
            Yeni Studio
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Çıxış
          </Button>
        </Box>
      </Box>

      {/* Cədvəl */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Studio Adı</TableCell>
              <TableCell align="center">Ümumi Baxış</TableCell>
              <TableCell align="center">Kart Baxışı</TableCell>
              <TableCell align="center">Telefon Baxışı</TableCell>
              <TableCell align="center">Ünvan Baxışı</TableCell>
              <TableCell align="center">Instagram Baxışı</TableCell>
              <TableCell align="center">WhatsApp Baxışı</TableCell>
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
                    title="Redaktə et"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(studio)}
                    title="Sil"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Silmə dialoqu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Studionu silmək istədiyinizə əminsiniz?
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedStudio?.name} studiosunu silmək istədiyinizə əminsiniz?
            Bu əməliyyat geri qaytarıla bilməz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Ləğv et
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
