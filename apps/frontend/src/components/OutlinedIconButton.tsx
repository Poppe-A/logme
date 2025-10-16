import { IconButton, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';

interface IOutlinedIconButton {
  onClick: () => void;
  disabled?: boolean;
}

const SyledIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.primary.main,
}));

export const OutlinedIconButton: React.FC<
  PropsWithChildren<IOutlinedIconButton>
> = ({ onClick, disabled = false, children }) => {
  return (
    <SyledIconButton onClick={onClick} disabled={disabled}>
      {children}
    </SyledIconButton>
  );
};
