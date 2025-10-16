import { Add } from '@mui/icons-material';
import { IconButton, styled, Typography } from '@mui/material';
import type { ReactNode } from 'react';

const StyledButton = styled(IconButton)`
  width: 4rem;
  height: 4rem;
  position: absolute;
  bottom: 5rem;
  right: 2rem;
  border-radius: 50%;
  color: black;
  background: rgba(154, 161, 169, 0.47);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1.7px);
  -webkit-backdrop-filter: blur(1.7px);
  border: 1px solid rgba(154, 161, 169, 0.13);
`;

interface IMainActionButton {
  onClick: () => void;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const MainActionButton: React.FC<IMainActionButton> = ({
  onClick,
  label,
  icon,
  disabled,
}) => {
  return (
    <StyledButton onClick={onClick} sx={{ boxShadow: 2 }} disabled={disabled}>
      {label ? (
        <Typography>{label}</Typography>
      ) : icon ? (
        icon
      ) : (
        <Add fontSize="large" />
      )}
    </StyledButton>
  );
};
