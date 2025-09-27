import {
  Box,
  FormControlLabel,
  FormGroup,
  styled,
  Switch,
  useColorScheme,
} from '@mui/material';
import { PageLayout } from '../../components/PageLayout';

const SettingsContainer = styled(Box)`
  padding-left: 3rem;
  margin-top: 3rem;
`;

export const SettingsPage: React.FC = () => {
  const { mode, setMode } = useColorScheme();

  const toggleThemeMode = (darkMode: boolean) => {
    setMode(darkMode ? 'dark' : 'light');
  };

  return (
    <PageLayout title="Settings">
      <SettingsContainer>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={ev => toggleThemeMode(ev.target.checked)}
              />
            }
            label="Dark mode"
          />
        </FormGroup>
      </SettingsContainer>
    </PageLayout>
  );
};
