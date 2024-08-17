import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';

function AbsenTable({ peminatan }) {
  const [absenData, setAbsenData] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);

  useEffect(() => {
    // Fetch all students by peminatan
    axios.get('http://159.223.74.201:8080/api/mahasiswa')
      .then(response => {
        const filteredMahasiswa = response.data.filter(mahasiswa => mahasiswa.peminatan === peminatan);
        setMahasiswaList(filteredMahasiswa);

        // Fetch absensi data
        return axios.get('http://159.223.74.201:8080/api/absen');
      })
      .then(response => {
        const absensiData = response.data || []; // Pastikan response.data tidak null

        const groupedData = absensiData.reduce((acc, curr) => {
          const key = `${curr.nama_mahasiswa}-${curr.peminatan}`;
          if (!acc[key]) {
            acc[key] = { nama_mahasiswa: curr.nama_mahasiswa, peminatan: curr.peminatan };
          }
          acc[key][`pertemuan${curr.pertemuan}`] = curr.status;
          return acc;
        }, {});

        // Integrate student data with absensi data
        const combinedData = mahasiswaList.map(mahasiswa => {
          const key = `${mahasiswa.nama_mahasiswa}-${mahasiswa.peminatan}`;
          return groupedData[key] || { nama_mahasiswa: mahasiswa.nama_mahasiswa, peminatan: mahasiswa.peminatan };
        });

        setAbsenData(combinedData);
      })
      .catch(error => {
        console.error('Error fetching absen data', error);
      });
  }, [peminatan, mahasiswaList]);

  const renderStatusIcon = (status) => {
    if (status === 'Hadir') {
      return <CheckCircleIcon style={{ color: 'green' }} />;
    } else if (status === 'Tidak Hadir') {
      return <CancelIcon style={{ color: 'red' }} />;
    } else {
      return <RemoveIcon style={{ color: 'grey' }} />;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: '20px' }}>
        Tabel Absensi - {peminatan}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama Mahasiswa</TableCell>
            {[...Array(14)].map((_, i) => (
              <TableCell key={i}>Pertemuan {i + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {absenData.map((absen, index) => (
            <TableRow key={index}>
              <TableCell>{absen.nama_mahasiswa}</TableCell>
              {[...Array(14)].map((_, i) => (
                <TableCell key={i}>
                  {renderStatusIcon(absen[`pertemuan${i + 1}`])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AbsenTable;
