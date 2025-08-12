import './App.css';
import styled from '@emotion/styled';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  const AppContainer = styled.div`
    height: 100%;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `;
  return (
    <AppContainer>
      <BrowserRouter></BrowserRouter>
      <div>
        <h1>cool</h1>
      </div>
    </AppContainer>
  );
};

export default App;
