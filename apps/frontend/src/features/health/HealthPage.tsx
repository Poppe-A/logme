import { PageLayout } from '../../components/PageLayout';
import { useTranslation } from 'react-i18next';

export const HealthPage: React.FC = () => {
  const { t } = useTranslation();
  return <PageLayout title={t('health.title')}></PageLayout>;
};
