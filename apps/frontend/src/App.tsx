import './App.css';
import styled from '@emotion/styled';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { DeviceProvider } from './contexts/deviceProvider';

const App = () => {
  const AppContainer = styled.div`
    height: 100vh;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `;
  return (
    <AppContainer>
      <DeviceProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DeviceProvider>
    </AppContainer>
  );
};

export default App;
