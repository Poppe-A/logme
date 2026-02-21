import { Box, Card, styled, Typography, useColorScheme } from '@mui/material';
import { PageLayout } from '../../components/PageLayout';
import { useTranslation } from 'react-i18next';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  SettingKey,
} from './settingApi';
import { SettingSwitch } from './SettingSwitch';

const SettingsContainer = styled(Box)`
  padding-inline: 1rem;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SettingsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
`;

export const SettingsPage: React.FC = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();

  const toggleThemeMode = (darkMode: boolean) => {
    setMode(darkMode ? 'dark' : 'light');
  };
  const { data: settings } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const handleSettingChange = (key: SettingKey, value: boolean) => {
    if (!settings) return;
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <PageLayout title={t('account.settings')}>
      <SettingsContainer>
        <SettingsCard>
          <Typography variant="h3">{t('settings.global')}</Typography>
          <SettingSwitch
            checked={mode === 'dark'}
            onChange={toggleThemeMode}
            label={t('settings.theme')}
          />
        </SettingsCard>
        <SettingsCard>
          <Typography variant="h3">{t('settings.dashboard')}</Typography>
          <SettingSwitch
            checked={settings?.[SettingKey.DASHBOARD_LAST_SESSIONS] ?? false}
            onChange={v =>
              handleSettingChange(SettingKey.DASHBOARD_LAST_SESSIONS, v)
            }
            label={t('settings.dashboardLastSessions')}
          />
          <SettingSwitch
            checked={settings?.[SettingKey.DASHBOARD_WEIGHT] ?? false}
            onChange={v => handleSettingChange(SettingKey.DASHBOARD_WEIGHT, v)}
            label={t('settings.dashboardWeight')}
          />
          <SettingSwitch
            checked={settings?.[SettingKey.DASHBOARD_HEART_RATE] ?? false}
            onChange={v =>
              handleSettingChange(SettingKey.DASHBOARD_HEART_RATE, v)
            }
            label={t('settings.dashboardHeartRate')}
          />
        </SettingsCard>
        <SettingsCard>
          <Typography variant="h3">{t('settings.health')}</Typography>
          <SettingSwitch
            checked={settings?.[SettingKey.HEALTH_WEIGHT] ?? false}
            onChange={v => handleSettingChange(SettingKey.HEALTH_WEIGHT, v)}
            label={t('settings.healthWeight')}
          />
          <SettingSwitch
            checked={settings?.[SettingKey.HEALTH_HEART_RATE] ?? false}
            onChange={v => handleSettingChange(SettingKey.HEALTH_HEART_RATE, v)}
            label={t('settings.healthHeartRate')}
          />
        </SettingsCard>
      </SettingsContainer>
    </PageLayout>
  );
};
