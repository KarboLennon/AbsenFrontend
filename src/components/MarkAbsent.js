import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Checkbox } from '@mui/material';

function MarkAbsent({ peminatan }) {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    axios.get('http://159.223.74.201:8080/api/students') // Endpoint untuk mendapatkan semua mahasiswa
      .then(response => {
        setStudents(response.data.filter(student => student.peminatan === peminatan));
      })
      .catch(error => {
        console.error('Error fetching student data', error);
      });
  }, [peminatan]);

  const handleCheckboxChange = (id_isc) => {
    setSelectedStudents(prev =>
      prev.includes(id_isc)
        ? prev.filter(id => id !== id_isc)
        : [...prev, id_isc]
    );
  };

  const handleMarkAbsent = () => {
    axios.post('http://159.223.74.201:8080/api/mark_absent', { students: selectedStudents, pertemuan: 1 }) // Ganti pertemuan sesuai kebutuhan
      .then(response => {
        alert('Mahasiswa telah ditandai sebagai Tidak Hadir');
      })
      .catch(error => {
        console.error('Error marking students as absent', error);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ padding: '20px' }}>
        Tandai Ketidakhadiran - {peminatan}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama Mahasiswa</TableCell>
            <TableCell>Tandai Tidak Hadir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id_isc}>
              <TableCell>{student.nama_mahasiswa}</TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedStudents.includes(student.id_isc)}
                  onChange={() => handleCheckboxChange(student.id_isc)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={handleMarkAbsent}>
        Tandai Tidak Hadir
      </Button>
    </TableContainer>
  );
}

export default MarkAbsent;
