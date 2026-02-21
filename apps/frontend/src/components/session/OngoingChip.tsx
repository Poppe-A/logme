import { Chip, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledOngoingChip = styled(Chip)`
  margin-left: auto;
`;

export const OngoingChip: React.FC = () => {
  const { t } = useTranslation();
  return (
    <StyledOngoingChip
      label={t('sessions.ongoing')}
      color="secondary"
      size="small"
    />
  );
};
