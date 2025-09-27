import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
  styled,
} from '@mui/material';
import { type MouseEventHandler, type PropsWithChildren } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

type StyledMobileProps = {
  isMobile?: boolean;
};

const StyledModal = styled(Modal, {
  shouldForwardProp: prop => prop !== 'isMobile',
})<StyledMobileProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 30rem;
  margin: auto;
  margin-inline: ${({ isMobile }) => (isMobile ? '1rem' : 'auto')};
`;

const ModalCard = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem;
  border-radius: 1rem;
  max-height: 100%;
  outline: none;
  width: 100%;
`;

const CardBody = styled(CardContent)`
  /* margin-top: 1rem; */
  padding: 0;
  /* padding-top: 1rem; */
  overflow: auto;
`;

const ButtonsContainer = styled(CardActions)`
  padding: 0;
  margin-top: 1.25rem;
  flex-direction: row;
  justify-content: end;
`;

interface IGenericModalProps {
  open: boolean;
  title: string;
  handleConfirm?:
    | MouseEventHandler<HTMLButtonElement>
    | (() => Promise<void>)
    | undefined;
  handleClose?: () => void;
}

export const GenericModal: React.FC<PropsWithChildren<IGenericModalProps>> = ({
  open,
  children,
  title,
  handleConfirm,
  handleClose,
}) => {
  const isMobile = useIsMobile();

  return (
    <StyledModal open={open} onClose={handleClose} isMobile={isMobile}>
      <ModalCard>
        <CardHeader title={title} />
        <CardBody>{children}</CardBody>
        <ButtonsContainer>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirmer
          </Button>
        </ButtonsContainer>
      </ModalCard>
    </StyledModal>
  );
};
