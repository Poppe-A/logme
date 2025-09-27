import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Menu,
  MenuItem,
  Paper,
  styled,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useMemo, useState, type SyntheticEvent } from 'react';
import {
  AccountCircle,
  FitnessCenter,
  MonitorHeart,
} from '@mui/icons-material';
import { useLogoutMutation } from '../features/auth/authApi';

const PaddedBox = styled(Box)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 3rem; /* hauteur BottomNav */
`;

export const MenuLayout = () => {
  const [logout] = useLogoutMutation();

  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openMenu = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToSettings = () => {
    navigate('/settings');
    handleClose();
  };

  const navItems = [
    { label: 'Sports', path: '/sports', icon: <FitnessCenter /> },
    { label: 'Sessions', path: '/sessions', icon: <ListAltIcon /> },
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Health', path: '/health', icon: <MonitorHeart /> },
    { label: 'Account', path: '/account', icon: <AccountCircle /> },
  ];

  const onChange = (value: string, event: SyntheticEvent) => {
    if (value === '/account') {
      openMenu(event);
    } else {
      navigate(value);
    }
  };

  const activePath = useMemo(() => {
    const pathBase = location.pathname.split('/')[1];

    return (
      navItems.find(item => item.path.split('/')[1] === pathBase)?.path ||
      '/account'
    );
  }, [location.pathname]);

  // todo move in separate components
  return (
    <>
      <PaddedBox>
        <Outlet />
      </PaddedBox>

      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomNavigation
          value={activePath}
          onChange={(event, newValue) => onChange(newValue, event)}
          showLabels
        >
          {navItems.map(item => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              value={item.path}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
        >
          <MenuItem onClick={goToSettings}>Settings</MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </Paper>
    </>
  );
};
