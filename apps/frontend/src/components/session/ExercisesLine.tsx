import { Box, Chip, styled } from '@mui/material';
import type { SessionExercise } from '../../features/session/types';

const StyledExercisesLine = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  overflow-x: scroll;
`;

interface ExercisesLineProps {
  sessionExercises?: SessionExercise[];
}

export const ExercisesLine: React.FC<ExercisesLineProps> = ({
  sessionExercises = [],
}) => (
  <StyledExercisesLine>
    {sessionExercises.map(sessionExercise => (
      <Chip
        key={sessionExercise.id}
        label={sessionExercise.exercise.name}
        size="small"
      />
    ))}
  </StyledExercisesLine>
);
