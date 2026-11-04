import { Chip, styled } from '@mui/material';

const StyledChip = styled(Chip)`
  margin-left: auto;
`;

interface IGenericChip {
  label: string;
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
}

export const GenericChip: React.FC<IGenericChip> = ({ label, color }) => {
  return <StyledChip label={label} color={color} size="small" />;
};
