import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const BackgroundImage = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://i.ibb.co.com/hY7ChC8/logo-removebg-preview.png)', // Menggunakan URL gambar
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const HomeText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '2rem',
  fontWeight: 'bold',
}));

const SubText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontSize: '1.2rem',
}));

const InstagramLink = styled(Button)(({ theme }) => ({
  backgroundColor: '#E1306C',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#C13584',
  },
  padding: theme.spacing(1, 3),
  fontSize: '1rem',
}));

function Home() {
  return (
    <BackgroundImage>
      <Container maxWidth="sm">
        <HomeText variant="h1">Selamat Datang di Aplikasi Absensi ISC</HomeText>
        <SubText variant="body1">
          Scan barcode Anda dengan mudah dan cepat untuk memulai absensi.
          Terhubung dengan kami untuk berita terbaru dan informasi lebih lanjut!
        </SubText>
        <InstagramLink
          href="https://www.instagram.com/isc.unpam" // Ganti dengan handle Instagram Anda
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow Us on Instagram
        </InstagramLink>
      </Container>
    </BackgroundImage>
  );
}

export default Home;
