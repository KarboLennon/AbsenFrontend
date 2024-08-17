import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function MarkAbsentForRemaining() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false); 
  const [absentCount, setAbsentCount] = useState(null);
  const [pertemuan, setPertemuan] = useState('');
  const [peminatan, setPeminatan] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (pertemuan && peminatan) {
      // Hitung berapa banyak mahasiswa yang belum ditandai sebagai hadir
      axios.get(`http://139.59.218.121:8080/api/absen/count_absent?pertemuan=${pertemuan}&peminatan=${peminatan}`)
        .then(response => {
          if (response.data && typeof response.data.absentCount === 'number') {
            setAbsentCount(response.data.absentCount);
          } else {
            setAbsentCount(0); // Pastikan absentCount di-set ke 0 jika respons tidak valid
          }
        })
        .catch(error => {
          console.error('Error fetching absent count', error);
          setAbsentCount(0); // Set absentCount ke 0 jika terjadi error
        });
    }
  }, [pertemuan, peminatan, success]);

  const handleMarkAbsent = () => {
    if (!pertemuan || !peminatan) {
      alert('Silakan pilih pertemuan dan peminatan terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    axios.post('http://localhost:8080/api/mark_remaining_absent', {
      peminatan: peminatan,
      pertemuan: pertemuan,
    })
    .then(response => {
      setSuccess(true);
      setIsLoading(false);
      setOpenConfirm(false); // Tutup popup setelah sukses
    })
    .catch(error => {
      console.error('Error marking remaining students as absent', error);
      setIsLoading(false);
    });
  };

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Tandai Mahasiswa yang Belum Hadir sebagai Tidak Hadir
      </Typography>
      
      {/* Dropdown untuk memilih pertemuan */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Pilih Pertemuan</InputLabel>
        <Select
          value={pertemuan}
          onChange={(e) => { setPertemuan(e.target.value); setSuccess(false); }}
        >
          {[...Array(14)].map((_, index) => (
            <MenuItem key={index + 1} value={index + 1}>Pertemuan {index + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dropdown untuk memilih peminatan */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Pilih Peminatan</InputLabel>
        <Select
          value={peminatan}
          onChange={(e) => { setPeminatan(e.target.value); setSuccess(false); }}
        >
          <MenuItem value="Website">Website</MenuItem>
          <MenuItem value="Mobile">Mobile</MenuItem>
          <MenuItem value="UI/UX">UI/UX</MenuItem>
        </Select>
      </FormControl>

      {pertemuan && peminatan && (
        <Typography variant="body1" gutterBottom>
          {absentCount !== null ? `${absentCount} mahasiswa belum absen.` : 'Menghitung mahasiswa yang belum absen...'}
        </Typography>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClickOpenConfirm} 
        disabled={isLoading || absentCount === 0 || !pertemuan || !peminatan} // Nonaktifkan jika tidak ada mahasiswa yang belum absen atau pertemuan/peminatan belum dipilih
        fullWidth
      >
        Tandai Tidak Hadir
      </Button>

      {isLoading && <CircularProgress style={{ marginTop: '20px' }} />}

      {success && <Typography variant="h6" color="green" style={{ marginTop: '20px' }}>Semua mahasiswa yang belum hadir telah ditandai tidak hadir!</Typography>}

      {/* Popup Konfirmasi */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menandai semua mahasiswa yang belum hadir pada pertemuan {pertemuan} di peminatan {peminatan} sebagai tidak hadir?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Batal
          </Button>
          <Button onClick={handleMarkAbsent} color="primary">
            Ya, Tandai
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MarkAbsentForRemaining;
