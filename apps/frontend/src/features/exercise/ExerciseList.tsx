import styled from '@emotion/styled';
import type { Exercise } from './exerciseApi';
import { Container, Typography, type Theme } from '@mui/material';
// import AdaptiveMultiColumnList from '../../components/AdaptiveMultiColumnList';
import { CardWithLongPress } from '../../components/CardWithLongPress';
import { ChevronRight } from '@mui/icons-material';
import { capitalizeFirstLetter } from '../../utils/format';

const ExercisesContainer = styled(Container)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
`;

const ExerciseItem = styled(CardWithLongPress)<{ theme?: Theme }>(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    cursor: 'pointer',
    backgroundColor: theme?.palette.background.card, // Couleur personnalisée définie dans le thème
    borderRadius: '8px',
  }),
);

// POURQUOI MIN HEIGHT 0
// Dans un parent flex en colonne, si le dernier enfant a height: auto par défaut, il peut dépasser le parent.
// Flexbox en colonne requiert min-height: 0 sur le container pour que flex: 1 fonctionne comme prévu.
// Sans ça, le navigateur calcule la hauteur comme “au moins le contenu”, et le parent dépasse 100vh.

interface IExerciseList {
  exercises: Exercise[];
  displayEditionModal: (exercise: Exercise) => void;
  displayContentDrawer: (exercise: Exercise) => void;
}

export const ExerciseList: React.FC<IExerciseList> = ({
  exercises,
  displayEditionModal,
  displayContentDrawer,
}) => {
  const renderExercises = () => {
    const sortedExercises = [...exercises].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return sortedExercises.map(exercise => (
      <ExerciseItem
        key={exercise.id}
        onClick={() => displayContentDrawer(exercise)}
        onLongPress={() => displayEditionModal(exercise)}
      >
        <Typography variant="h4">
          {capitalizeFirstLetter(exercise.name)}
        </Typography>
        <ChevronRight />
      </ExerciseItem>
    ));
  };

  return (
    <ExercisesContainer>
      {/* <AdaptiveMultiColumnList items={renderExercises()} /> */}
      {renderExercises()}
    </ExercisesContainer>
  );
};
