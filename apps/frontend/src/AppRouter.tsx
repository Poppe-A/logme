import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import AuthGate from './features/auth/authGate';
import { SportsPage } from './features/sport/SportPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { ExercisePage } from './features/exercise/ExercisePage';
import { NewSession } from './features/session/NewSession';
import { SessionList } from './features/session/SessionList';
import { Session } from './features/session/Session';
import { MenuLayout } from './components/MenuLayout';
import { SettingsPage } from './features/settings/SettingsPage';
import { HealthPage } from './features/health/HealthPage';

export const AppRouter = () => (
  <AuthGate>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MenuLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/sports/:id/exercises" element={<ExercisePage />} />
        <Route path="sessions/new" element={<NewSession />} />
        <Route path="/sessions/:sessionId" element={<Session />} />
        <Route path="/sessions" element={<SessionList />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/health" element={<HealthPage />} />
      </Route>
      {/* <Route path="/sports" element={<Login />} />
    <Route path="/sports/:sportId/exercises" element={<Login />} />
    <Route path="/health" element={<Login />} />
    <Route path="/new-session" element={<Login />} />
    <Route path="/ongoing-sessions" element={<Login />} />
    <Route path="/settings" element={<Login />} /> */}
    </Routes>
  </AuthGate>
);
