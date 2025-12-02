import { IconButton, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';

type StyledIconButtonProps =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

interface IOutlinedIconButton {
  onClick: () => void;
  color?: StyledIconButtonProps;
  disabled?: boolean;
  className?: string;
}

const SyledIconButton = styled(IconButton)<{
  buttonColor: StyledIconButtonProps;
}>(({ theme, buttonColor }) => ({
  border: '1px solid',
  borderColor: theme.palette[buttonColor].main,
}));

export const OutlinedIconButton: React.FC<
  PropsWithChildren<IOutlinedIconButton>
> = ({ onClick, disabled = false, children, color = 'primary', className }) => {
  return (
    <SyledIconButton
      onClick={onClick}
      disabled={disabled}
      buttonColor={color}
      className={className}
    >
      {children}
    </SyledIconButton>
  );
};
