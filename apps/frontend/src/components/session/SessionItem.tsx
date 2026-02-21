import { Container, styled, type Theme } from '@mui/material';

export const SessionItem = styled(Container)<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  padding: '1rem',
  gap: '0.5rem',
  cursor: 'pointer',
  backgroundColor: theme?.palette.background.card,
  overflow: 'hidden',
  borderRadius: '8px',
}));
