import { Box, Divider, styled, Typography } from '@mui/material';
import type { EarlierSessionForInformation } from './types';
import { format } from 'date-fns';

const EarlierSessionContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
  border: white 1px solid;
  /* margin-top: 1rem; */
  padding: 0.5rem;
`;

const SetsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const SetContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;
interface IPreviousSessionResults {
  earlierSessionResults: EarlierSessionForInformation;
}

export const PreviousSessionResults: React.FC<IPreviousSessionResults> = ({
  earlierSessionResults,
}) => {
  return (
    <EarlierSessionContainer>
      <StyledTypography>
        {earlierSessionResults.name} -{' '}
        {format(earlierSessionResults.startDate, 'd/MM/y')}
      </StyledTypography>
      <SetsContainer>
        {earlierSessionResults.sets.map((set, index) => (
          <>
            <SetContainer key={set.id}>
              <Typography>{set.repetitions} reps</Typography>
              <Typography>{set.weight} kg</Typography>
            </SetContainer>
            {index < earlierSessionResults.sets.length - 1 && (
              <Divider orientation="vertical" flexItem />
            )}
          </>
        ))}
      </SetsContainer>
    </EarlierSessionContainer>
  );
};
