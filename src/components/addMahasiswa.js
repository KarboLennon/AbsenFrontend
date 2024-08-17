import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, DialogContentText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

function AddMahasiswa() {
  const [namaMahasiswa, setNamaMahasiswa] = useState('');
  const [kelas, setKelas] = useState('');
  const [reguler, setReguler] = useState('');
  const [peminatan, setPeminatan] = useState('');
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State untuk konfirmasi dialog

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenConfirmDialog(true); // Tampilkan konfirmasi dialog sebelum submit
  };

  const handleConfirmSubmit = () => {
    const newMahasiswa = {
      nama_mahasiswa: namaMahasiswa,
      kelas: kelas,
      reguler: reguler,
      peminatan: peminatan,
    };

    axios.post('http://139.59.218.121:8080/api/mahasiswa', newMahasiswa, {
      headers: {
        'Authorization': localStorage.getItem('token'),
      }
    })
    .then(response => {
      setMessage(`Mahasiswa ${response.data.nama_mahasiswa} berhasil ditambahkan dengan ID ISC: ${response.data.id_isc}`);
      setOpenDialog(true); // Tampilkan dialog saat berhasil
      setNamaMahasiswa('');
      setKelas('');
      setReguler('');
      setPeminatan('');
    })
    .catch(error => {
      console.error('Error adding mahasiswa', error);
      setMessage('Terjadi kesalahan saat menambahkan mahasiswa.');
      setOpenDialog(true); // Tampilkan dialog saat ada error
    })
    .finally(() => {
      setOpenConfirmDialog(false); // Tutup dialog konfirmasi setelah submit
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Tambah Data Mahasiswa
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nama Mahasiswa"
          value={namaMahasiswa}
          onChange={(e) => setNamaMahasiswa(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Kelas"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="Reguler"
          value={reguler}
          onChange={(e) => setReguler(e.target.value)}
          required
          margin="normal"
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="CK">CK</MenuItem>
          <MenuItem value="CS">CS</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Peminatan"
          value={peminatan}
          onChange={(e) => setPeminatan(e.target.value)}
          required
          margin="normal"
        >
          <MenuItem value="Website">Website</MenuItem>
          <MenuItem value="Mobile">Mobile</MenuItem>
          <MenuItem value="UI/UX">UI/UX</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Tambah Mahasiswa
        </Button>
      </form>

      {/* Dialog Konfirmasi */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          <Box display="flex" alignItems="center">
            <WarningIcon color="warning" style={{ marginRight: '8px' }} />
            Konfirmasi Tambah Mahasiswa
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Apakah Anda yakin ingin menambahkan mahasiswa ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Tambahkan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Hasil */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {message.includes('berhasil') ? (
            <Box display="flex" alignItems="center">
              <CheckCircleIcon color="success" style={{ marginRight: '8px' }} />
              Sukses
            </Box>
          ) : (
            'Kesalahan'
          )}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddMahasiswa;
