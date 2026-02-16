import AnnouncementIcon from '@mui/icons-material/Announcement';
import GarageIcon from '@mui/icons-material/Garage';
import HomeIcon from '@mui/icons-material/Home';
import LabelIcon from '@mui/icons-material/Label';
import MenuIcon from '@mui/icons-material/Menu';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { Avatar, Box, IconButton, LinearProgress, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCRMUsers } from 'src/context/CRMUsersContext/useCRMUsers';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import UtilService from 'src/services/UtilService';
import ConfirmationModalAsync from 'src/shared/components/confirmation_modal_async/ConfirmationModalAsync';
import CustomSnackbar from 'src/shared/components/snackbar/CustomSnackbar';
import './DashboardLayout.css';
import ProfileDrawer from './ProfileDrawer';
import ConfirmationModal from 'src/shared/components/confirmation_modal/ConfirmationModal';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useAuth } from 'src/context/AuthContext/useAuth';
const SECTIONS: {
  path: string,
  label: string,
  icon: ReactNode
}[] = [{ path: "/dashboard/home", label: "Inicio", icon: <HomeIcon /> }, { path: "/dashboard/news", label: "Noticias", icon: <NewspaperIcon /> }, 
  { path: "/dashboard/tags", icon: <LabelIcon />, label: "Etiquetas" }, 
  { path: "/dashboard/yt-videos", icon: <YouTubeIcon />, label: "Videos YT"},
]
const DashboardLayout: FC<any> = () => {
  const navigate = useNavigate();
  const { hash } = useParams();
  const {signOut,authenticatedUser} = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [collapseLatNavbar, setCollapseLatNavbar] = useState(false);
  const { isLoading, setSnackbarMessage, confirmationModal, confirmationModalAsync, setConfirmationModalAsync, setConfirmationModal, goFoward, changesMade } = useCRMCommon();
  const location = useLocation();
  const handleLogout = () => {
    navigate('/crm/' + hash + "/login");
    signOut();
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  // openProfile
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {
  }, [location])


  return (
    <div className={"dashboard-container"}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className={"dashboard-header"}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setCollapseLatNavbar(!collapseLatNavbar)}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Configuraciones">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={authenticatedUser && authenticatedUser.profileImage ? UtilService.resolveFile(authenticatedUser?.profileImage.fileUrl) : ''} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => {
              handleCloseUserMenu();
              setOpenProfile(true);
            }}>
              <Typography sx={{ textAlign: 'center' }}>Perfil</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography sx={{ textAlign: 'center' }}>Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </header>
      <div className={"content-wrapper"}>
        {
          isLoading &&
          <Box sx={{ width: '100%', position: "absolute", top: 0, left: 0 }} >
            <LinearProgress color='error' />
          </Box>
        }
        <aside className={`${"dashboard-sidebar"} ${collapseLatNavbar ? "collapsed" : ''}`}>
          <nav>
            <ul>
              {SECTIONS.map(({ path, label, icon }, index) => (
                <li key={index}>
                  <button className={(location.pathname.includes(path ?? '')) ? 'active' : ''} onClick={() => !changesMade ? navigate(`/crm/${hash}${path}`) : setConfirmationModal({ action: () => goFoward(() => navigate(`/crm/${hash}${path}`)), show: true, message: "Se han detectado cambios, si continua con la acción los descartará" })} >{icon} <span>{label}</span></button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className={"dashboard-content"}>
          <Outlet />
        </main>
      </div>
      <CustomSnackbar />
      {authenticatedUser && <ProfileDrawer close={() => setOpenProfile(false)} open={openProfile} />}
      {confirmationModalAsync && <ConfirmationModalAsync reset={() => setConfirmationModalAsync(null)} confirmationModal={confirmationModalAsync} setNotification={setSnackbarMessage}></ConfirmationModalAsync>}
      {confirmationModal && <ConfirmationModal reset={() => setConfirmationModal(null)} confirmationModal={confirmationModal} setNotification={setSnackbarMessage}></ConfirmationModal>}

    </div>
  );
};


export default DashboardLayout;