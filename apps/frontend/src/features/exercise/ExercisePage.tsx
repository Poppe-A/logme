import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import { useGetSportsQuery } from '../sport/sportApi';
import { useEffect, useState } from 'react';
import { Box, Drawer, styled, Typography } from '@mui/material';
import {
  useCreateExerciseMutation,
  useGetExercisesQuery,
  useUpdateExerciseMutation,
  type Exercise,
} from './exerciseApi';
import React from 'react';
import { ExerciseForm } from './ExerciseForm';
import { capitalizeFirstLetter } from '../../utils/format';
import { ExerciseList } from './ExerciseList';
import { MainActionButton } from '../../components/MainActionButton';

const DrawerContentContainer = styled(Box)`
  width: 100%;
  min-height: 10rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const DrawerContentLine = styled(Box)`
  display: flex;
  /* gap: 0.5rem; */
`;

export const ExercisePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const sportId = Number(params.id);
  const [isEditionModalOpen, setIsEditionModalOpen] = useState(false);
  const [isContentDrawerOpen, setIsContentDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [createSport] = useCreateExerciseMutation();
  const [updateSport] = useUpdateExerciseMutation();

  const { data: exercises, isLoading } = useGetExercisesQuery({ sportId });

  const { data: sports } = useGetSportsQuery();
  const selectedSport = sports?.find(s => s.id === sportId);
  const pageTitle = selectedSport
    ? `${capitalizeFirstLetter(selectedSport.name)} - Exercises`
    : '';

  const displayEditionModal = (exercise: Exercise | null) => {
    setIsEditionModalOpen(true);
    setSelectedExercise(exercise);
  };

  const closeEditionModal = () => {
    setSelectedExercise(null);
    setIsEditionModalOpen(false);
  };

  const displayContentDrawer = (exercise: Exercise | null) => {
    console.log('-displa');
    setIsContentDrawerOpen(true);
    setSelectedExercise(exercise);
  };

  const closeContentDrawer = () => {
    console.log('-close');

    setSelectedExercise(null);
    setIsContentDrawerOpen(false);
  };

  const onSubmit = (exercise: Exercise) => {
    if (selectedExercise) {
      updateSport({
        exercise: { id: selectedExercise.id, ...exercise },
        sportId,
      });
    } else {
      createSport({ exercise, sportId });
    }
  };

  useEffect(() => {
    if (sports?.length && !isLoading && !selectedSport) {
      navigate('/sports');
    }
  }, [sports, isLoading, selectedSport, navigate]);

  return (
    <PageLayout title={pageTitle} isLoading={isLoading} displayBackArrow>
      {exercises?.length ? (
        <ExerciseList
          exercises={exercises}
          displayEditionModal={displayEditionModal}
          displayContentDrawer={displayContentDrawer}
        />
      ) : (
        <Typography>Ce sport n'a pas encore d'exercices</Typography>
      )}

      <ExerciseForm
        exercise={selectedExercise}
        isOpen={isEditionModalOpen}
        onSubmit={onSubmit}
        closeModal={closeEditionModal}
      />
      <Drawer
        anchor={'bottom'}
        open={isContentDrawerOpen}
        onClose={closeContentDrawer}
      >
        <DrawerContentContainer role="presentation">
          <Typography>{`Exercice : ${selectedExercise?.name}`}</Typography>
          {(selectedExercise?.altName || selectedExercise?.secondAltName) && (
            <DrawerContentLine>
              <Typography>Autres noms : </Typography>
              {selectedExercise?.altName && (
                <Typography>{selectedExercise.altName}</Typography>
              )}
              {selectedExercise?.secondAltName && (
                <Typography>{` - ${selectedExercise.secondAltName}`}</Typography>
              )}
            </DrawerContentLine>
          )}
          {selectedExercise?.description && (
            <Typography>{selectedExercise.description}</Typography>
          )}
        </DrawerContentContainer>
      </Drawer>

      <MainActionButton onClick={() => displayEditionModal(null)} />
    </PageLayout>
  );
};
