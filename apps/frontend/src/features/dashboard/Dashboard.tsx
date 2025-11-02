import { Container } from '@mui/material';
import { useAppSelector } from '../../utils/store';
import { selectUser } from '../auth/authSlice';
import { PageLayout } from '../../components/PageLayout';
import { useTranslation } from 'react-i18next';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  // todo dashboard avec metrics, menu pour les raccourcis
  return (
    <PageLayout title={`${t('dashboard.welcome')} ${user?.firstname} !`}>
      <Container></Container>
    </PageLayout>
  );
};
