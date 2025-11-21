import styled from '@emotion/styled';
import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router';

interface IPageLayout {
  title?: string;
  subtitle?: string | ReactElement;
  button?: ReactElement;
  isLoading?: boolean;
  displayBackArrow?: boolean;
}

const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 2rem; */
  height: 100%; /* au lieu de 100vh */
  /* overflow: hidden; */
  box-sizing: border-box;
`;

const StyledHeader = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  padding-top: 2rem;
  padding-left: 2rem;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const StyledIconButton = styled(IconButton)`
  align-self: self-start;
`;

export const PageLayout: React.FC<PropsWithChildren<IPageLayout>> = ({
  title,
  subtitle,
  isLoading,
  button,
  children,
  displayBackArrow,
}) => {
  const navigate = useNavigate();
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(-1);
  };

  return (
    <PageContainer>
      <StyledHeader>
        {displayBackArrow && (
          <StyledIconButton onClick={handleBackClick}>
            <ArrowBack />
          </StyledIconButton>
        )}
        {title && <Typography variant="h3">{title}</Typography>}
        {subtitle && typeof subtitle === 'string' ? (
          <Typography variant="h4">{subtitle}</Typography>
        ) : (
          subtitle
        )}
        {button}
      </StyledHeader>
      <Box sx={{ flex: 1, width: '100%', overflowY: 'auto' }}>
        {isLoading ? <CircularProgress /> : children}
      </Box>{' '}
    </PageContainer>
  );
};
