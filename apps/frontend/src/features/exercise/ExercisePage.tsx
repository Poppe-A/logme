import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout';
import { useGetSportsQuery } from '../sport/sportApi';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
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
import { ExerciseDrawer } from './ExerciseDrawer';
import { useTranslation } from 'react-i18next';

export const ExercisePage: React.FC = () => {
  const { t } = useTranslation();
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
    ? `${capitalizeFirstLetter(selectedSport.name)}`
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
    setIsContentDrawerOpen(true);
    setSelectedExercise(exercise);
  };

  const closeContentDrawer = () => {
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
    <PageLayout
      title={pageTitle}
      subtitle={t('exercises.title')}
      isLoading={isLoading}
    >
      {exercises?.length ? (
        <ExerciseList
          exercises={exercises}
          displayEditionModal={displayEditionModal}
          displayContentDrawer={displayContentDrawer}
        />
      ) : (
        <Typography>{t('exercises.noExercise')}</Typography>
      )}

      <ExerciseForm
        exercise={selectedExercise}
        isOpen={isEditionModalOpen}
        onSubmit={onSubmit}
        closeModal={closeEditionModal}
      />

      <ExerciseDrawer
        isOpen={isContentDrawerOpen}
        onClose={closeContentDrawer}
        exercise={selectedExercise}
      />
      <MainActionButton onClick={() => displayEditionModal(null)} />
    </PageLayout>
  );
};
