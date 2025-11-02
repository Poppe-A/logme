import {
  AccountCircle,
  FitnessCenter,
  MonitorHeart,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';

export const MenuLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { label: t('menu.sports'), path: '/sports', icon: <FitnessCenter /> },
      { label: t('menu.sessions'), path: '/sessions', icon: <ListAltIcon /> },
      { label: t('menu.dashboard'), path: '/', icon: <DashboardIcon /> },
      { label: t('menu.health'), path: '/health', icon: <MonitorHeart /> },
      { label: t('menu.account'), path: '/account', icon: <AccountCircle /> },
    ],
    [t],
  );

  const activePath = useMemo(() => {
    const pathBase = location.pathname.split('/')[1];
    return (
      navItems.find(item => item.path.split('/')[1] === pathBase)?.path ||
      '/account'
    );
  }, [location.pathname, navItems]);

  return <MobileMenu navItems={navItems} activePath={activePath} />;
};
