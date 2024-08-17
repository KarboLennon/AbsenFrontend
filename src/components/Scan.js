import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import { Paper, Box, Typography, IconButton, Fade, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  borderRadius: '15px',
  backgroundColor: theme.palette.grey[200],
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
}));

const ScannerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  backgroundColor: theme.palette.background.default,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  animation: 'zoomIn 0.5s ease-in-out',
  '@keyframes zoomIn': {
    '0%': {
      transform: 'scale(0)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));

function BarcodeScanner() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [studentName, setStudentName] = useState(''); // State for storing the student name

  useEffect(() => {
    startScanner();
  }, []);

  const startScanner = () => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: document.querySelector('#interactive'),
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment', // pastikan kamera belakang digunakan
        },
      },
      decoder: {
        readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader', 'upc_e_reader'],
      },
      locator: {
        patchSize: 'medium',
        halfSample: true,
      },
      locate: true,
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
      Quagga.initialized = true;
    });
    

    Quagga.onDetected(handleDetected);
  };

  const handleDetected = (result) => {
    if (result && result.codeResult) {
      const code = result.codeResult.code;
      setScanResult(code);
      Quagga.stop();
      console.log("Barcode detected: ", code);
      axios.post('http://139.59.218.121:8080/api/absen', {
        id_isc: code,
        status: 'Hadir',
      })
      .then((response) => {
        console.log("Response received: ", response.data);
        setStudentName(response.data.nama_mahasiswa); // Set student name from response
        setStatus('success'); // Set status to success

        setTimeout(() => {
          setStatus(null); // Reset status after showing success message
          startScanner(); // Restart the scanner
        }, 2000); // Delay before restarting scanner
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log("ID not found.");
          setStatus('error'); // Set status to error if ID not found

          setTimeout(() => {
            setStatus(null); // Reset status after showing error message
            startScanner(); // Restart the scanner
          }, 2000); // Delay before restarting scanner
        } else if (error.response && error.response.status === 500) {
          console.error('Server error, please check the backend:', error.response.data);
        } else {
          console.error('Terjadi kesalahan saat menyimpan absen', error);
        }
      });
    }
  };

  const handleClose = () => {
    // If you want to navigate away when closing, you can uncomment the line below
    navigate('/');
    console.log('Scanner closed');
  };

  return (
    <ScannerBox>
      <StyledPaper elevation={3}>
        <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Scan Barcode untuk Absen
        </Typography>
        <div id="interactive" className="viewport" style={{ width: '100%', height: '300px', marginBottom: '20px', borderRadius: '15px', overflow: 'hidden', border: '2px solid #ccc' }} />

        {status === null && (
          <CircularProgress color="primary" />
        )}

        {status === 'success' && (
          <Fade in={true}>
            <IconWrapper>
              <CheckCircleIcon style={{ fontSize: 80, color: 'green' }} />
              <Typography variant="h6" color="green">
                Absen {scanResult} - {studentName} berhasil
              </Typography>
            </IconWrapper>
          </Fade>
        )}

        {status === 'error' && (
          <Fade in={true}>
            <IconWrapper>
              <CancelIcon style={{ fontSize: 80, color: 'red' }} />
              <Typography variant="h6" color="red">
                {scanResult} tidak terdaftar
              </Typography>
            </IconWrapper>
          </Fade>
        )}

        <Typography variant="body1" style={{ marginTop: '20px' }}>
          {status === null ? `Hasil Scan: ${scanResult}` : ""}
        </Typography>
      </StyledPaper>
    </ScannerBox>
  );
}

export default BarcodeScanner;
