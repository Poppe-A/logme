import { Box, Drawer, styled, Typography } from '@mui/material';
import type { Exercise } from './exerciseApi';
import { useTranslation } from 'react-i18next';

const DrawerContentContainer = styled(Box)`
  width: 100%;
  min-height: 10rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const DrawerContentLine = styled(Box)`
  display: flex;
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
  const { t } = useTranslation();
  return (
    <Drawer anchor={'bottom'} open={isOpen} onClose={onClose}>
      <DrawerContentContainer role="presentation">
        <Typography>{`Exercice : ${exercise?.name}`}</Typography>
        {(exercise?.altName || exercise?.secondAltName) && (
          <DrawerContentLine>
            <Typography>{t('exercises.altNames')} : </Typography>
            {exercise?.altName && <Typography>{exercise.altName}</Typography>}
            {exercise?.secondAltName && (
              <Typography>{` - ${exercise.secondAltName}`}</Typography>
            )}
          </DrawerContentLine>
        )}
        {exercise?.description && (
          <Typography>{exercise.description}</Typography>
        )}
      </DrawerContentContainer>
    </Drawer>
  );
};
