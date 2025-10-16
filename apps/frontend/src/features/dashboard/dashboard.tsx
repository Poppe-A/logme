import { Button, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../utils/store';
import { selectUser } from '../auth/authSlice';
import { PageLayout } from '../../components/PageLayout';
import { useTranslation } from 'react-i18next';

const ShortcutButton = styled(Button)`
  width: 10rem;
`;

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  // todo dashboard avec metrics, menu pour les raccourcis
  return (
    <PageLayout
      title={`${t('dashboard.welcome')} ${user?.firstname} ! ${user?.id}`}
    >
      <Grid container spacing={2}>
        <Grid size={6}>
          <ShortcutButton
            variant="contained"
            onClick={() => {
              navigate('/sports');
            }}
          >
            Sports
          </ShortcutButton>
        </Grid>
        <Grid size={6}>
          <ShortcutButton variant="contained">Stats ph siques</ShortcutButton>
        </Grid>
        <Grid size={6}>
          <ShortcutButton
            variant="contained"
            onClick={() => {
              navigate('/sessions');
            }}
          >
            Mes séances
          </ShortcutButton>
        </Grid>
        <Grid size={6}>
          <ShortcutButton variant="contained">Options</ShortcutButton>
        </Grid>
        <Grid size={6}>
          <ShortcutButton
            variant="contained"
            onClick={() => {
              navigate('sessions/new');
            }}
          >
            New Session
          </ShortcutButton>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
