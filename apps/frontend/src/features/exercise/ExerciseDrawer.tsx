import { Box, Drawer, styled, Typography } from '@mui/material';
import type { Exercise } from './exerciseApi';
import { capitalizeFirstLetter } from '../../utils/format';

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    border-radius: 20px 20px 0 0;
    background-color: transparent;
  }
  & .MuiBackdrop-root {
    background-color: transparent;
  }
`;
const DrawerContentContainer = styled(Box)`
  width: 100%;
  height: 100%;
  min-height: 10rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 20px 20px 0 0;
  background-color: ${({ theme }) => theme.palette.background.card};
`;

const DrawerContentLine = styled(Box)`
  display: flex;
`;

const Description = styled(Typography)`
  margin-top: 1rem;
`;

interface IExerciseDrawer {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export const ExerciseDrawer: React.FC<IExerciseDrawer> = ({
  exercise,
  onClose,
  isOpen,
}) => {
  return (
    <StyledDrawer anchor={'bottom'} open={isOpen} onClose={onClose}>
      <DrawerContentContainer role="presentation">
        <Typography>{capitalizeFirstLetter(exercise?.name || '')}</Typography>
        {(exercise?.altName || exercise?.secondAltName) && ( // todo fonction pour rendre alt names
          <DrawerContentLine>
            <Typography variant="caption">(</Typography>
            {exercise?.altName && (
              <Typography variant="caption">{exercise.altName}</Typography>
            )}
            {exercise?.secondAltName && (
              <Typography variant="caption">{` / ${exercise.secondAltName}`}</Typography>
            )}
            <Typography variant="caption">)</Typography>
          </DrawerContentLine>
        )}
        {exercise?.description && (
          <Description>
            {capitalizeFirstLetter(exercise?.description || '')}
          </Description>
        )}
      </DrawerContentContainer>
    </StyledDrawer>
  );
};
