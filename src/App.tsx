import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './store/AppContext';
import { BottomNav } from './components/BottomNav';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AIManager } from './pages/AIManager';
import { MyTeam } from './pages/MyTeam';
import { Contests } from './pages/Contests';
import { Profile } from './pages/Profile';
import { Transfers } from './pages/Transfers';
import { LiveMatch } from './pages/LiveMatch';
import { Insights } from './pages/Insights';
import { TeamBuilder } from './pages/TeamBuilder';

function Shell() {
  const { authed } = useApp();
  const loc = useLocation();

  if (!authed) return <Login />;

  const showNav = ['/home', '/ai', '/team', '/contests', '/profile'].some((p) => loc.pathname.startsWith(p));

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/home" element={<Home />} />
          <Route path="/ai" element={<AIManager />} />
          <Route path="/team" element={<MyTeam />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/live" element={<LiveMatch />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/builder" element={<TeamBuilder />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}
