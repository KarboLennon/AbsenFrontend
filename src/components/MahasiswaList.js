import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useAuth } from './AuthContext'; // Pastikan useAuth diimpor

function MahasiswaList() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const { user } = useAuth(); // Mengambil informasi pengguna dari useAuth

  useEffect(() => {
    axios.get('http://159.223.74.201:8080/api/mahasiswa')
      .then(response => {
        setMahasiswaList(response.data);
      })
      .catch(error => {
        console.error('Error fetching mahasiswa list', error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: '20px' }}>
        Daftar Mahasiswa
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID ISC</TableCell>
            <TableCell>Nama Mahasiswa</TableCell>
            <TableCell>Kelas</TableCell>
            <TableCell>Reguler</TableCell>
            <TableCell>Peminatan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mahasiswaList.map((mahasiswa, index) => (
            <TableRow key={index}>
              <TableCell>{mahasiswa.id_isc}</TableCell>
              <TableCell>{mahasiswa.nama_mahasiswa}</TableCell>
              <TableCell>{mahasiswa.kelas}</TableCell>
              <TableCell>{mahasiswa.reguler}</TableCell>
              <TableCell>{mahasiswa.peminatan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MahasiswaList;
