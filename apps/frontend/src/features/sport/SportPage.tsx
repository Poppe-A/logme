import { Box, Typography } from '@mui/material';
import {
  useCreateSportMutation,
  useGetSportsQuery,
  useUpdateSportMutation,
  type Sport,
} from './sportApi';
import { useState } from 'react';
import styled from '@emotion/styled';
import { PageLayout } from '../../components/PageLayout';
import { SportForm } from './SportForm';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/format';
import { CardWithLongPress } from '../../components/CardWithLongPress';
import { ChevronRight } from '@mui/icons-material';
import { MainActionButton } from '../../components/MainActionButton';
import { useTranslation } from 'react-i18next';

const SportItem = styled(CardWithLongPress)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 0.3rem;
  padding-left: 1.3rem;
  padding-right: 0.3rem;
  padding: 2rem;
  cursor: pointer;
`;

const StyledBox = styled(Box)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0; /* important pour que flex autorise le shrink */
  overflow-y: auto; /* permet le scroll */
  width: 100%;
`;

export function SportsPage() {
  const { t } = useTranslation();
  const { data: sports, isLoading } = useGetSportsQuery();
  const [updateSport] = useUpdateSportMutation();
  const [createSport] = useCreateSportMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const navigate = useNavigate();

  const displayModal = (sport: Sport | null) => {
    setIsModalOpen(true);
    setSelectedSport(sport);
  };

  const closeModal = () => {
    setSelectedSport(null);
    setIsModalOpen(false);
  };

  const navigateToSport = (sportId: Sport['id']) => {
    navigate(`/sports/${sportId}/exercises`);
  };

  const displaySports = () => {
    if (sports) {
      const sortedSports = [...sports].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      return sortedSports?.map(sport => (
        <SportItem
          key={sport.id}
          onClick={() => navigateToSport(sport.id)}
          onLongPress={() => displayModal(sport)}
          elevation={0}
        >
          <Typography>{capitalizeFirstLetter(sport.name)}</Typography>
          <ChevronRight />
        </SportItem>
      ));
    } else {
      return null;
    }
  };
  return (
    <PageLayout title={t('sports.title')} isLoading={isLoading}>
      <StyledBox>{displaySports()}</StyledBox>
      <SportForm
        isOpen={isModalOpen}
        closeModal={closeModal}
        sport={selectedSport}
        onSubmit={selectedSport ? updateSport : createSport}
      />
      <MainActionButton onClick={() => displayModal(null)} />
    </PageLayout>
  );
}
