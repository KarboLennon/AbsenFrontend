import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import MahasiswaList from './components/MahasiswaList';
import AbsenTable from './components/AbsenTable';
import Scan from './components/Scan';
import Login from './components/Login';
import MarkAbsentForRemaining from './components/MarkAbsentForRemaining';
import Home from './components/Home'; 
import AddMahasiswa from './components/addMahasiswa'; // Import komponen AddMahasiswa
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ScanIcon from '@mui/icons-material/CameraAlt'; // Ikon untuk scan
import WarningIcon from '@mui/icons-material/Warning'; // Ikon untuk warning
import AddIcon from '@mui/icons-material/Add'; // Ikon untuk tambah
import ListIcon from '@mui/icons-material/List'; // Ikon untuk list
import LoginIcon from '@mui/icons-material/Login'; // Ikon untuk login
import LogoutIcon from '@mui/icons-material/Logout'; // Ikon untuk logout
import { AuthProvider, useAuth } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Navigation />
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
            <Route path="/mahasiswa-list" element={<MahasiswaList />} />
            <Route path="/absen-table/website" element={<AbsenTable peminatan="Website" />} />
            <Route path="/absen-table/mobile" element={<AbsenTable peminatan="Mobile" />} />
            <Route path="/absen-table/uiux" element={<AbsenTable peminatan="UI/UX" />} />
            <Route path="/mark-absent-remaining" element={<ProtectedRoute><MarkAbsentForRemaining /></ProtectedRoute>} />
            <Route path="/add-mahasiswa" element={<ProtectedRoute><AddMahasiswa /></ProtectedRoute>} /> {/* Rute untuk menambahkan mahasiswa */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/'); // Redirect ke beranda setelah logout
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Beranda" />
        </ListItem>
        <Divider />
        {user && user.role === 'admin' && (
          <>
            <ListItem button component={Link} to="/scan">
              <ListItemIcon>
                <ScanIcon />
              </ListItemIcon>
              <ListItemText primary="Scan Absen" />
            </ListItem>
            <ListItem button component={Link} to="/mark-absent-remaining">
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText primary="Tandai Tidak Hadir Sisa Mahasiswa" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/add-mahasiswa">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Tambah Mahasiswa" />
            </ListItem>
          </>
        )}
        <ListItem button component={Link} to="/mahasiswa-list">
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Data Mahasiswa" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/absen-table/website">
          <ListItemText primary="Software Development - Website" />
        </ListItem>
        <ListItem button component={Link} to="/absen-table/mobile">
          <ListItemText primary="Software Development - Mobile" />
        </ListItem>
        <ListItem button component={Link} to="/absen-table/uiux">
          <ListItemText primary="UI/UX Design" />
        </ListItem>
        <Divider />
        {!user ? (
          <ListItem button component={Link} to="/login">
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        ) : (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Absensi ISC
      </Typography>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>

      <Dialog
        open={logoutDialogOpen}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Apakah Anda yakin ingin keluar?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            Batal
          </Button>
          <Button onClick={confirmLogout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Typography>Access Denied</Typography>;
  }

  return children;
}

export default App;
