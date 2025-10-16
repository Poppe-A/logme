import { Outlet, useNavigate } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Menu,
  MenuItem,
  Paper,
  styled,
} from '@mui/material';

import { useState, type SyntheticEvent } from 'react';

import { useLogoutMutation } from '../../features/auth/authApi';
import { useTranslation } from 'react-i18next';

const PaddedBox = styled(Box)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 3rem; /* hauteur BottomNav */
`;

interface IMobileMenuProps {
  navItems: { label: string; path: string; icon: React.ReactNode }[];
  activePath: string;
}

export const MobileMenu: React.FC<IMobileMenuProps> = ({
  navItems,
  activePath,
}) => {
  const [logout] = useLogoutMutation();
  const { t } = useTranslation();
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

  const onChange = (value: string, event: SyntheticEvent) => {
    if (value === '/account') {
      openMenu(event);
    } else {
      navigate(value);
    }
  };

  // add desktop menu
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
          <MenuItem onClick={goToSettings}>{t('account.settings')}</MenuItem>
          <MenuItem onClick={() => logout()}>{t('account.logout')}</MenuItem>
        </Menu>
      </Paper>
    </>
  );
};
